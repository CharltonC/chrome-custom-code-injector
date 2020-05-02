module.exports = {
    defOption: {
        lint: {
            // formatter: 'verbose'      // will cause warning to emit error
            // formatter: 'prose'
            configuration: "tslint.json"
        },
        report: {
            allowWarnings: false
        }
    },
    tasks: {
        main: {
            inputFiles: [
                'src/**/*.ts',
                '!src/**/*.d.ts'
            ]
        }
    }
};