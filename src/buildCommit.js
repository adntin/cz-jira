function escape(result) {
  // For some strange reason, we have to pass additional '\' slash to commitizen. Total slashes are 4.
  // If user types "feat: `string`", the commit preview should show "feat: \\`string\\`".
  // Don't worry. The git log will be "feat: `string`"
  return result.replace(new RegExp(/`/, "g"), "\\\\`");
}

// { type: 'feat', title: 'FIJI-2000', summary: 'SUMMARY', desc: 'DESC' }
const buildCommit = ({ type, title, summary, desc }) => {
  const result = `${type}(${title.trim()}): [${summary.trim()}] ${desc}`;
  return escape(result);
};

module.exports = buildCommit;
