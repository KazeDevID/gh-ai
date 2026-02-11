const { HtmlFetchParser } = require('html-fetch-parser');
const github = require('@actions/github').context;
const core = require('@actions/core');

async function run() {
  try {
    const token = process.env.GH_TOKEN;
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    // Get comment details
    const commentBody = github.context.payload.comment.body;
    const commentId = github.context.payload.comment.id;
    const issueNumber = github.context.payload.issue?.number || github.context.payload.pull_request?.number;

    // Prevent looping: Ignore if the comment is from a bot
    if (github.context.payload.comment.user.type === 'Bot') return;

    // Fetch content from the HTML parser
    const parser = await HtmlFetchParser.fetch('https://raw.githubusercontent.com/KazeDevID/html-fetch-parser/refs/heads/main/README.md');

    // Get the first <h1> text as a sample response
    const aiReply = parser.getText('h1');

    // Send a reply to GitHub
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: `**AI Assistant:** \n\n${aiReply}`
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
