const fs = require("fs");
const path = require("path");
const littlelog = require("@littlethings/log");

const log = littlelog.create("Auto Issue");

littlelog.setVerbosity("INFO");

module.exports = async ({ github, context }) => {
    const creator = context.payload.sender.login;

    log.info(`Issue from "${creator}".`);

    const opts = github.issues.listForRepo.endpoint.merge({
        ...context.issue,
        creator,
        state: "all",
    });

    const issues = await github.paginate(opts);

    let isFirstSubmission = true;
    for (const issue of issues) {
        if (issue.number === context.issue.number) {
            continue;
        }

        if (issue.pull_request) {
            isFirstSubmission = false;
            break;
        }
    }

    if (isFirstSubmission) {
        log.info(`First submission from "${creator}".`);
        const body = fs.readFileSync(path.resolve(__dirname, "welcome.md"), {
            encoding: "utf8",
        });

        await github.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body,
        });
    }

    // @TODO(jakehamilton): check for package name
    // const issueBody = context.payload.issue.body;
};
