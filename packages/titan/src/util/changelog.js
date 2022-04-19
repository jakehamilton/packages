const CHANGELOG_HEADER = "# Change Log\n";
const CHANGELOG_HEADER_LINES = CHANGELOG_HEADER.split("\n").length;

const renderNote = (note) => {
    if (note.trim() === "") return "";

    return `### Notes

${note}`;
};

const renderChanges = (title, changes) => {
    if (changes.length === 0) {
        return "";
    }

    const contents = changes.map((change) => {
        return `- ${change.breaking ? "**BREAKING CHANGE** " : ""}${
            change.scope ? `_${change.scope}_: ` : ""
        }${change.title}`;
    });

    return `### ${title}

${contents.join("\n\n")}`;
};

const changes = (upgrade, note = "") => {
    const features = [];
    const fixes = [];
    const chores = [];
    const others = [];

    for (const commit of upgrade.commits) {
        const match = /^(?<type>feat|fix|chore|\w+)(?<scope>\([^\(\)]+\))?:\s?(?<title>.+)/.exec(
            commit.title
        );

        if (match) {
            switch (match.groups.type) {
                case "feat":
                    features.push({
                        ...match.groups,
                        breaking: Boolean(
                            commit.body &&
                                commit.body.match(/^BREAKING CHANGE/g)
                        ),
                    });
                    break;
                case "fix":
                    fixes.push({
                        ...match.groups,
                        breaking: Boolean(
                            commit.body &&
                                commit.body.match(/^BREAKING CHANGE/g)
                        ),
                    });
                    break;
                case "chore":
                    chores.push({
                        ...match.groups,
                        breaking: Boolean(
                            commit.body &&
                                commit.body.match(/^BREAKING CHANGE/g)
                        ),
                    });
                    break;
                default:
                    others.push({
                        ...match.groups,
                        breaking: Boolean(
                            commit.body &&
                                commit.body.match(/^BREAKING CHANGE/g)
                        ),
                    });
                    break;
            }
        }
    }

    const contents = [
        renderChanges("Features", features),
        renderChanges("Fixes", fixes),
        renderChanges("Chores", chores),
        renderChanges("Other", others),
        renderNote(note),
    ].filter((text) => text !== "");

    return contents.join("\n\n");
};

const patch = (changelog, upgrade, note) => {
    const contents = changelog
        .split("\n")
        .slice(CHANGELOG_HEADER_LINES)
        .join("\n");

    const newContents = changes(upgrade, note);

    return `${CHANGELOG_HEADER}
## ${upgrade.newVersion}

${newContents}

${contents}`;
};

const create = (
    pkg,
    upgrade = {
        name: pkg.config.name,
        version: pkg.config.version,
        newVersion: pkg.config.version,
        pkg,
        commits: [],
        bump: "major",
    },
    note
) => {
    return patch(CHANGELOG_HEADER, upgrade, note);
};

module.exports = {
    patch,
    create,
};
