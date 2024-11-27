const parser = require('../index.js')
const fs = require('fs')
const cwd = process.cwd()

// Tests

test('parse foliant.yml', async () => {
    const configPath = 'test/foliant.yml'
    const configContent =fs.readFileSync(configPath, 'utf-8')
    process.env['TEST_3_PATH'] = '../test/test-3.md';
    const expectConfigObj = {
        title: "Test-project",
        chapters: [
            "test.md",
            `${cwd}/test/test-2.md`,
            `${cwd}/test/test-2.md`,
            "../test/test-2.md",
            "../test/test-3.md",
            {
                "Section chapters":[
                    "test-4.md",
                    "test-5.md"
                ]
            },
            {
                "Section foliant-2":[
                    "test-6.md"
                ]
            }
        ],
        backend_config: {
            pre: {
                slug: "Test-project"
            }
        }
    }
    const configObj = parser.getFoliantConfig(configContent)

    expect(configObj).toEqual(expectConfigObj)
})