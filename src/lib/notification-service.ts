import { prisma } from '@/lib/prisma';
import { getEmailService } from '@/lib/email-service';
import { NotificationTemplate, createNotificationEmail } from '@/lib/notification-templates';

export interface NotificationData {
  userId: string;
  type: 'GRADE_UPDATE' | 'ATTENDANCE_ALERT' | 'PAYMENT_DUE' | 'ANNOUNCEMENT' | 'MESSAGE' | 'APPOINTMENT' | 'HAFALAN_PROGRESS' | 'ACHIEVEMENT' | 'GENERAL';
  title: string;
  message: string;
  data?: Record<string, any>;
  actionUrl?: string;
  actionText?: string;
  channels?: ('in_app' | 'email' | 'push' | 'sms' | 'whatsapp')[];
  scheduledFor?: Date;
  expiresAt?: Date;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  category?: 'Academic' | 'Financial' | 'General' | 'Achievement' | 'Activity';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  categories: {
    academic: boolean;
    financial: boolean;
    general: boolean;
    achievement: boolean;
    activity: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "07:00"
  };
  frequency: 'IMMEDIATE' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST';
}

class NotificationService {
  async createNotification(data: NotificationData): Promise<string> {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: JSON.stringify(data.data || {}),
        actionUrl: data.actionUrl,
        actionText: data.actionText,
        channels: JSON.stringify(data.channels || ['in_app']),
        scheduledFor: data.scheduledFor,
        expiresAt: data.expiresAt,
      },
    });

    // Process notification based on channels and user preferences
    await this.processNotification(notification.id);

    return notification.id;
  }

  async processNotification(notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        user: {
          include: {
            parentAccount: true,
          },
        },
      },
    });

    if (!notification) return;

    // Check if notification should be sent now or scheduled
    if (notification.scheduledFor && notification.scheduledFor > new Date()) {
      // Will be processed by scheduled job
      return;
    }

    // Get user preferences
    const preferences = await this.getUserPreferences(notification.userId);
    const channels = JSON.parse(notification.channels);

    // Check if user allows this type of notification
    const category = this.getNotificationCategory(notification.type);
    if (!preferences.categories[category.toLowerCase() as keyof typeof preferences.categories]) {
      return;
    }

    // Check quiet hours
    if (this.isInQuietHours(preferences.quietHours)) {
      // Schedule for later
      const nextAllowedTime = this.getNextAllowedTime(preferences.quietHours);
      await prisma.notification.update({
        where: { id: notificationId },
        data: { scheduledFor: nextAllowedTime },
      });
      return;
    }

    // Process each channel
    for (const channel of channels) {
      switch (channel) {
        case 'email':
          if (preferences.email) {
            await this.sendEmailNotification(notification);
          }
          break;
        case 'push':
          if (preferences.push) {
            await this.sendPushNotification(notification);
          }
          break;
        case 'sms':
          if (preferences.sms) {
            await this.sendSMSNotification(notification);
          }
          break;
        case 'whatsapp':
          if (preferences.whatsapp) {
            await this.sendWhatsAppNotification(notification);
          }
          break;
      }
    }
  }

  private async sendEmailNotification(notification: any) {
    try {
      const emailService = getEmailService();
      const template = createNotificationEmail({
        title: notification.title,
        message: notification.message,
        actionUrl: notification.actionUrl,
        actionText: notification.actionText,
        recipientName: notification.user.name,
      });

      const sent = await emailService.sendEmail(notification.user.email, template);
      
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          emailSent: sent,
          emailSentAt: sent ? new Date() : undefined,
        },
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  private async sendPushNotification(notification: any) {
    // Implementation for push notifications
    // This would integrate with services like Firebase Cloud Messaging
    try {
      // Placeholder for push notification logic
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          pushSent: true,
          pushSentAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  }

  private async sendSMSNotification(notification: any) {
    // Implementation for SMS notifications
    try {
      // Placeholder for SMS logic (integrate with Twilio, etc.)
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          smsSent: true,
          smsSentAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    }
  }

  private async sendWhatsAppNotification(notification: any) {
    try {
      const { getWhatsAppService } = await import('@/lib/whatsapp-service');
      const whatsappService = getWhatsAppService();

      // Get user's WhatsApp number
      const whatsappNumber = await this.getUserWhatsAppNumber(notification.userId);
      if (!whatsappNumber) {
        console.log('No WhatsApp number found for user:', notification.userId);
        return;
      }

      // Send notification via WhatsApp
      const result = await whatsappService.sendNotificationViaWhatsApp(
        whatsappNumber,
        notification.type,
        notification.title,
        notification.message
      );

      // Update notification status
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          // Note: We don't have whatsappSent field in the schema yet
          // This would require a migration to add these fields
          // whatsappSent: result.success,
          // whatsappSentAt: result.success ? new Date() : undefined,
        },
      });

      if (!result.success) {
        console.error('Failed to send WhatsApp notification:', result.error);
      }
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error);
    }
  }

  private async getUserWhatsAppNumber(userId: string): Promise<string | null> {
    try {
      // Try to get WhatsApp number from parent account
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          parentAccount: true,
        },
      });

      if (user?.parentAccount?.whatsapp) {
        return user.parentAccount.whatsapp;
      }

      // If no WhatsApp number in parent account, try to get from student data
      // This assumes the user is linked to a student record
      const student = await prisma.student.findFirst({
        where: {
          OR: [
            { fatherPhone: { not: null } },
            { motherPhone: { not: null } },
            { guardianPhone: { not: null } },
          ],
        },
      });

      // Return the first available phone number (you might want to be more specific)
      return student?.fatherPhone || student?.motherPhone || student?.guardianPhone || null;
    } catch (error) {
      console.error('Error getting WhatsApp number:', error);
      return null;
    }
  }

  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        parentAccount: true,
      },
    });

    // Default preferences
    const defaults: NotificationPreferences = {
      email: true,
      push: true,
      sms: false,
      whatsapp: false,
      categories: {
        academic: true,
        financial: true,
        general: true,
        achievement: true,
        activity: true,
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00',
      },
      frequency: 'IMMEDIATE',
    };

    if (user?.parentAccount?.notificationSettings) {
      try {
        const settings = JSON.parse(user.parentAccount.notificationSettings);
        return { ...defaults, ...settings };
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }

    return defaults;
  }

  async updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { parentAccount: true },
    });

    if (!user) return;

    const currentPrefs = await this.getUserPreferences(userId);
    const newPrefs = { ...currentPrefs, ...preferences };

    if (user.parentAccount) {
      await prisma.parentAccount.update({
        where: { userId },
        data: {
          notificationSettings: JSON.stringify(newPrefs),
        },
      });
    } else {
      // For non-parent users, we might store preferences differently
      // For now, we'll create a parent account entry
      await prisma.parentAccount.create({
        data: {
          userId,
          notificationSettings: JSON.stringify(newPrefs),
        },
      });
    }
  }

  async getUnreadNotifications(userId: string, limit = 20) {
    return await prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getAllNotifications(userId: string, limit = 50, offset = 0) {
    return await prisma.notification.findMany({
      where: {
        userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async markAsRead(notificationId: string) {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getNotificationStats(userId: string) {
    const [total, unread] = await Promise.all([
      prisma.notification.count({
        where: { userId },
      }),
      prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      }),
    ]);

    return { total, unread };
  }

  // Helper methods
  private getNotificationCategory(type: string): string {
    const categoryMap: Record<string, string> = {
      GRADE_UPDATE: 'Academic',
      ATTENDANCE_ALERT: 'Academic',
      PAYMENT_DUE: 'Financial',
      ANNOUNCEMENT: 'General',
      MESSAGE: 'General',
      APPOINTMENT: 'General',
      HAFALAN_PROGRESS: 'Academic',
      ACHIEVEMENT: 'Achievement',
      GENERAL: 'General',
    };

    return categoryMap[type] || 'General';
  }

  private isInQuietHours(quietHours: NotificationPreferences['quietHours']): boolean {
    if (!quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
    
    const start = quietHours.start;
    const end = quietHours.end;
    
    // Handle overnight quiet hours (e.g., 22:00 - 07:00)
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    } else {
      return currentTime >= start && currentTime <= end;
    }
  }

  private getNextAllowedTime(quietHours: NotificationPreferences['quietHours']): Date {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [endHour, endMinute] = quietHours.end.split(':').map(Number);
    
    // If quiet hours end today
    const endToday = new Date(now);
    endToday.setHours(endHour, endMinute, 0, 0);
    
    if (endToday > now) {
      return endToday;
    }
    
    // Otherwise, end time tomorrow
    const endTomorrow = new Date(tomorrow);
    endTomorrow.setHours(endHour, endMinute, 0, 0);
    
    return endTomorrow;
  }

  // Bulk notification methods
  async createBulkNotifications(notifications: NotificationData[]): Promise<string[]> {
    const createdNotifications = await prisma.notification.createMany({
      data: notifications.map(data => ({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: JSON.stringify(data.data || {}),
        actionUrl: data.actionUrl,
        actionText: data.actionText,
        channels: JSON.stringify(data.channels || ['in_app']),
        scheduledFor: data.scheduledFor,
        expiresAt: data.expiresAt,
      })),
    });

    // Get the IDs of created notifications
    const notificationIds = await prisma.notification.findMany({
      where: {
        userId: { in: notifications.map(n => n.userId) },
        createdAt: { gte: new Date(Date.now() - 60000) }, // Last minute
      },
      select: { id: true },
    });

    // Process each notification
    for (const notification of notificationIds) {
      await this.processNotification(notification.id);
    }

    return notificationIds.map((n: { id: string }) => n.id);
  }

  // Announcement notifications
  async sendAnnouncementNotification(announcementId: string) {
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement || announcement.status !== 'PUBLISHED') return;

    // Get target users based on announcement settings
    const targetUsers = await this.getAnnouncementTargetUsers(announcement);

    const notifications: NotificationData[] = targetUsers.map((user: { id: string }) => ({
      userId: user.id,
      type: 'ANNOUNCEMENT',
      title: announcement.title,
      message: announcement.summary || announcement.content.substring(0, 200) + '...',
      data: { announcementId },
      actionUrl: `/announcements/${announcementId}`,
      actionText: 'View Announcement',
      channels: ['in_app', 'email'],
      priority: announcement.priority as any,
      category: 'General',
    }));

    return await this.createBulkNotifications(notifications);
  }

  private async getAnnouncementTargetUsers(announcement: any) {
    // Implementation to get target users based on announcement settings
    let whereClause: any = {};

    switch (announcement.targetAudience) {
      case 'PARENTS':
        whereClause = { role: 'PARENT' };
        break;
      case 'TEACHERS':
        whereClause = { role: { in: ['USTADZ', 'ADMIN'] } };
        break;
      case 'STUDENTS':
        whereClause = { role: 'STUDENT' };
        break;
      case 'SPECIFIC_CLASS':
        // Implementation for specific class targeting
        const targetClasses = JSON.parse(announcement.targetClasses || '[]');
        if (targetClasses.length > 0) {
          // Get students in specific classes
          const students = await prisma.student.findMany({
            where: {
              studentClasses: {
                some: {
                  classId: { in: targetClasses },
                  status: 'ACTIVE',
                },
              },
            },
            include: { parentStudents: { include: { parent: { include: { user: true } } } } },
          });
          
          // Return parent users
          return students.flatMap((s: any) => s.parentStudents.map((ps: any) => ps.parent.user));
        }
        break;
      case 'ALL':
      default:
        whereClause = { isActive: true };
        break;
    }

    return await prisma.user.findMany({
      where: whereClause,
    });
  }
}

// Singleton instance
let notificationService: NotificationService | null = null;

export const getNotificationService = (): NotificationService => {
  if (!notificationService) {
    notificationService = new NotificationService();
  }
  return notificationService;
};

export default NotificationService;