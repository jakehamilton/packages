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
        log.info(`First submission from "${creator}", adding welcome comment.`);
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

    log.info("Assigning default assignees to issue.");
    await github.issues.addAssignees({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        assignees: ["jakehamilton"],
    });

    // @TODO(jakehamilton): check for package name
    const issueBody = context.payload.issue.body.replace("\r\n", "\n");
    console.log(issueBody.split("\n"));

    let type = "invalid";

    for (const line of issueBody.split("\n")) {
        const match = line.match(/^<!-- @type: (\w+) -->$/);
        if (match) {
            if (match[1] === "bug" || match[1] === "feature") {
                type = match[1];
            }
            break;
        }
    }

    await github.issues.addLabels({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        labels: [type, "needs triage"],
    });
};
