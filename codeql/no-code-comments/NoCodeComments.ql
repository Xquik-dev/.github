// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

/**
 * @name Code comment
 * @description Code has no comments. A comment needs a legal marker, a functional directive or an https link that proves it.
 * @kind problem
 * @problem.severity error
 * @id js/no-code-comments
 */

import javascript

predicate proven(Comment comment) {
  comment.getText().regexpMatch("(?s).*(https://|SPDX-).*")
  or
  exists(Comment next |
    next.getNextToken() = comment.getNextToken() and
    next.getLocation().getStartLine() = comment.getLocation().getEndLine() + 1 and
    proven(next)
  )
}

predicate directive(Comment comment) {
  comment
      .getText()
      .regexpMatch("(?s)\\s*(eslint-disable(-next-line|-line)?|eslint-enable|eslint|globals?|exported)(\\s.*)?|\\s*@ts-(check|nocheck|expect-error|ignore)\\b.*|\\s*prettier-ignore\\b.*|\\s*(c8|v8|istanbul) ignore\\b.*|.*[#@]__(PURE|NO_SIDE_EFFECTS)__.*")
  or
  comment instanceof SlashSlashComment and comment.getText().regexpMatch("/\\s*<reference\\s.*")
  or
  comment instanceof DocComment and comment.getText().regexpMatch("\\s*@type\\s*\\{[^\\n]*")
}

from Comment comment
where
  exists(comment.getFile().getRelativePath()) and
  not proven(comment) and
  not directive(comment)
select comment, "Code has no comments. Put the meaning in names, types and tests."
