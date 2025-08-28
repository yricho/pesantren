#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const REPORTS_DIR = path.join(PROJECT_ROOT, 'test-reports')

async function ensureDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (error) {
    console.warn(`Could not create directory ${dir}:`, error.message)
  }
}

async function runCommand(command, description) {
  console.log(`\n🔍 ${description}...`)
  try {
    const result = execSync(command, { 
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe']
    })
    console.log(`✅ ${description} completed`)
    return result
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message)
    return null
  }
}

async function generateCoverageReport() {
  console.log('📊 Generating comprehensive test coverage report...')
  
  await ensureDirectory(REPORTS_DIR)
  
  const report = {
    projectName: 'Pondok Imam Syafi\'i Blitar Management System',
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    testSuites: {},
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      coverage: {
        lines: { covered: 0, total: 0, percentage: 0 },
        branches: { covered: 0, total: 0, percentage: 0 },
        functions: { covered: 0, total: 0, percentage: 0 },
        statements: { covered: 0, total: 0, percentage: 0 }
      }
    },
    performance: {},
    accessibility: {},
    security: {}
  }

  // Run unit tests with coverage
  const unitTestResult = await runCommand(
    'npm run test:coverage -- --json --outputFile=test-reports/unit-results.json --passWithNoTests',
    'Running unit tests with coverage'
  )

  if (unitTestResult) {
    try {
      const unitResults = JSON.parse(await fs.readFile(
        path.join(REPORTS_DIR, 'unit-results.json'),
        'utf8'
      ))
      
      report.testSuites.unit = {
        name: 'Unit Tests',
        numTotalTests: unitResults.numTotalTests || 0,
        numPassedTests: unitResults.numPassedTests || 0,
        numFailedTests: unitResults.numFailedTests || 0,
        testResults: unitResults.testResults || []
      }

      report.summary.totalTests += unitResults.numTotalTests || 0
      report.summary.passedTests += unitResults.numPassedTests || 0
      report.summary.failedTests += unitResults.numFailedTests || 0
    } catch (error) {
      console.warn('Could not parse unit test results:', error.message)
    }
  }

  // Parse coverage data
  try {
    const coverageFile = path.join(PROJECT_ROOT, 'coverage', 'coverage-summary.json')
    const coverage = JSON.parse(await fs.readFile(coverageFile, 'utf8'))
    
    if (coverage.total) {
      report.summary.coverage = {
        lines: {
          covered: coverage.total.lines.covered || 0,
          total: coverage.total.lines.total || 0,
          percentage: coverage.total.lines.pct || 0
        },
        branches: {
          covered: coverage.total.branches.covered || 0,
          total: coverage.total.branches.total || 0,
          percentage: coverage.total.branches.pct || 0
        },
        functions: {
          covered: coverage.total.functions.covered || 0,
          total: coverage.total.functions.total || 0,
          percentage: coverage.total.functions.pct || 0
        },
        statements: {
          covered: coverage.total.statements.covered || 0,
          total: coverage.total.statements.total || 0,
          percentage: coverage.total.statements.pct || 0
        }
      }
    }
  } catch (error) {
    console.warn('Could not parse coverage data:', error.message)
  }

  // Run integration tests
  const integrationTestResult = await runCommand(
    'npm run test:integration -- --json --outputFile=test-reports/integration-results.json --passWithNoTests',
    'Running integration tests'
  )

  if (integrationTestResult) {
    try {
      const integrationResults = JSON.parse(await fs.readFile(
        path.join(REPORTS_DIR, 'integration-results.json'),
        'utf8'
      ))
      
      report.testSuites.integration = {
        name: 'Integration Tests',
        numTotalTests: integrationResults.numTotalTests || 0,
        numPassedTests: integrationResults.numPassedTests || 0,
        numFailedTests: integrationResults.numFailedTests || 0,
        testResults: integrationResults.testResults || []
      }

      report.summary.totalTests += integrationResults.numTotalTests || 0
      report.summary.passedTests += integrationResults.numPassedTests || 0
      report.summary.failedTests += integrationResults.numFailedTests || 0
    } catch (error) {
      console.warn('Could not parse integration test results:', error.message)
    }
  }

  // Run E2E tests if available
  const e2eTestResult = await runCommand(
    'npm run test:e2e -- --reporter=json --output-file=test-reports/e2e-results.json',
    'Running E2E tests'
  )

  if (e2eTestResult) {
    try {
      const e2eResults = JSON.parse(await fs.readFile(
        path.join(REPORTS_DIR, 'e2e-results.json'),
        'utf8'
      ))
      
      report.testSuites.e2e = {
        name: 'End-to-End Tests',
        numTotalTests: e2eResults.stats?.tests || 0,
        numPassedTests: e2eResults.stats?.passes || 0,
        numFailedTests: e2eResults.stats?.failures || 0,
        testResults: e2eResults.tests || []
      }

      report.summary.totalTests += e2eResults.stats?.tests || 0
      report.summary.passedTests += e2eResults.stats?.passes || 0
      report.summary.failedTests += e2eResults.stats?.failures || 0
    } catch (error) {
      console.warn('Could not parse E2E test results:', error.message)
    }
  }

  // Generate HTML report
  const htmlReport = generateHTMLReport(report)
  await fs.writeFile(path.join(REPORTS_DIR, 'test-report.html'), htmlReport)

  // Generate JSON report
  await fs.writeFile(
    path.join(REPORTS_DIR, 'test-report.json'),
    JSON.stringify(report, null, 2)
  )

  // Generate summary
  console.log('\n📋 Test Summary:')
  console.log('================')
  console.log(`Total Tests: ${report.summary.totalTests}`)
  console.log(`Passed: ${report.summary.passedTests}`)
  console.log(`Failed: ${report.summary.failedTests}`)
  console.log(`Success Rate: ${report.summary.totalTests > 0 ? 
    ((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(2) : 0}%`)
  console.log('\n📊 Coverage Summary:')
  console.log(`Lines: ${report.summary.coverage.lines.percentage}%`)
  console.log(`Branches: ${report.summary.coverage.branches.percentage}%`)
  console.log(`Functions: ${report.summary.coverage.functions.percentage}%`)
  console.log(`Statements: ${report.summary.coverage.statements.percentage}%`)

  // Check if coverage meets requirements
  const coverageThreshold = {
    lines: 85,
    branches: 80,
    functions: 90,
    statements: 85
  }

  let coveragePassed = true
  Object.keys(coverageThreshold).forEach(key => {
    if (report.summary.coverage[key].percentage < coverageThreshold[key]) {
      console.log(`❌ ${key} coverage (${report.summary.coverage[key].percentage}%) below threshold (${coverageThreshold[key]}%)`)
      coveragePassed = false
    } else {
      console.log(`✅ ${key} coverage (${report.summary.coverage[key].percentage}%) meets threshold (${coverageThreshold[key]}%)`)
    }
  })

  console.log(`\n📁 Reports generated in: ${REPORTS_DIR}`)
  console.log(`📊 HTML Report: ${path.join(REPORTS_DIR, 'test-report.html')}`)
  console.log(`📄 JSON Report: ${path.join(REPORTS_DIR, 'test-report.json')}`)

  if (!coveragePassed) {
    console.log('\n❌ Coverage requirements not met')
    process.exit(1)
  } else {
    console.log('\n✅ All coverage requirements met')
  }

  return report
}

function generateHTMLReport(report) {
  const coverageColor = (percentage) => {
    if (percentage >= 90) return '#4caf50'
    if (percentage >= 80) return '#ff9800'
    if (percentage >= 70) return '#f44336'
    return '#f44336'
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Coverage Report - ${report.projectName}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .metric { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
            border-left: 4px solid #007bff; 
        }
        .metric h3 { margin: 0 0 10px; color: #333; }
        .metric .value { font-size: 2em; font-weight: bold; color: #007bff; }
        .metric .label { color: #666; font-size: 0.9em; }
        .coverage-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 30px 0; 
        }
        .coverage-item { 
            background: white; 
            border: 1px solid #e0e0e0; 
            border-radius: 8px; 
            padding: 20px; 
            text-align: center; 
        }
        .coverage-item h4 { margin: 0 0 15px; color: #333; }
        .progress-circle { 
            width: 100px; 
            height: 100px; 
            margin: 0 auto 15px; 
            position: relative; 
        }
        .test-suites { margin-top: 30px; }
        .test-suite { 
            background: #f8f9fa; 
            border: 1px solid #e0e0e0; 
            border-radius: 8px; 
            margin-bottom: 20px; 
            overflow: hidden; 
        }
        .test-suite-header { 
            background: #e9ecef; 
            padding: 15px 20px; 
            font-weight: bold; 
            border-bottom: 1px solid #dee2e6; 
        }
        .test-suite-content { padding: 20px; }
        .test-stats { 
            display: flex; 
            gap: 20px; 
            margin-bottom: 15px; 
        }
        .test-stat { 
            flex: 1; 
            text-align: center; 
            padding: 10px; 
            background: white; 
            border-radius: 4px; 
        }
        .passed { color: #4caf50; }
        .failed { color: #f44336; }
        .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            border-top: 1px solid #e0e0e0; 
        }
        @media (max-width: 768px) {
            .summary { grid-template-columns: 1fr; }
            .coverage-grid { grid-template-columns: 1fr; }
            .test-stats { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Test Coverage Report</h1>
            <p>${report.projectName}</p>
            <p>Generated on ${new Date(report.generatedAt).toLocaleString()}</p>
        </div>
        
        <div class="content">
            <div class="summary">
                <div class="metric">
                    <h3>Total Tests</h3>
                    <div class="value">${report.summary.totalTests}</div>
                    <div class="label">Test Cases</div>
                </div>
                <div class="metric">
                    <h3>Passed</h3>
                    <div class="value passed">${report.summary.passedTests}</div>
                    <div class="label">Successful Tests</div>
                </div>
                <div class="metric">
                    <h3>Failed</h3>
                    <div class="value failed">${report.summary.failedTests}</div>
                    <div class="label">Failed Tests</div>
                </div>
                <div class="metric">
                    <h3>Success Rate</h3>
                    <div class="value">${report.summary.totalTests > 0 ? 
                      ((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(1) : 0}%</div>
                    <div class="label">Overall Success</div>
                </div>
            </div>
            
            <h2>Code Coverage</h2>
            <div class="coverage-grid">
                ${Object.entries(report.summary.coverage).map(([key, data]) => `
                    <div class="coverage-item">
                        <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                        <div style="font-size: 2em; font-weight: bold; color: ${coverageColor(data.percentage)}">
                            ${data.percentage.toFixed(1)}%
                        </div>
                        <div style="color: #666; margin-top: 5px;">
                            ${data.covered} / ${data.total}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <h2>Test Suites</h2>
            <div class="test-suites">
                ${Object.entries(report.testSuites).map(([key, suite]) => `
                    <div class="test-suite">
                        <div class="test-suite-header">${suite.name}</div>
                        <div class="test-suite-content">
                            <div class="test-stats">
                                <div class="test-stat">
                                    <div style="font-size: 1.5em; font-weight: bold;">${suite.numTotalTests}</div>
                                    <div>Total Tests</div>
                                </div>
                                <div class="test-stat">
                                    <div style="font-size: 1.5em; font-weight: bold; color: #4caf50;">${suite.numPassedTests}</div>
                                    <div>Passed</div>
                                </div>
                                <div class="test-stat">
                                    <div style="font-size: 1.5em; font-weight: bold; color: #f44336;">${suite.numFailedTests}</div>
                                    <div>Failed</div>
                                </div>
                                <div class="test-stat">
                                    <div style="font-size: 1.5em; font-weight: bold;">${suite.numTotalTests > 0 ? 
                                      ((suite.numPassedTests / suite.numTotalTests) * 100).toFixed(1) : 0}%</div>
                                    <div>Success Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="footer">
            <p>Report generated by Pondok Imam Syafi'i Blitar Test Suite</p>
            <p>For questions or issues, contact the development team</p>
        </div>
    </div>
</body>
</html>
  `.trim()
}

// Run the report generation
if (require.main === module) {
  generateCoverageReport().catch(error => {
    console.error('Failed to generate test report:', error)
    process.exit(1)
  })
}

module.exports = { generateCoverageReport }