module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["hooks/**/*.ts", "step-definitions/**/*.ts"],
    format: ["progress", "html:reports/cucumber-report.html"],
    formatOptions: {
      snippetInterface: "async-await"
    },
    publishQuiet: true
  }
};