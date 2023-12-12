#Using esLint + prettier and precommit hooks 
##Precommit hook prevents pushing javascript files that contains linter errors and everyone should enable it

###To use precommit hook rename file precommit.template hook to on repository root .git/hooks/pre-commit
´cp suomen-vaylat-app/linterReports/precommit.template .git/hooks/pre-commit´

###Running eslint prettier report manually, report will be generated on suomen-vaylat-app/linter folder
´npm run lint˙

##EsLint ja prettier install and configuration

###Install
####Add dependencies
´npm add -D prettier@^2.5.1 eslint@^8.7.0´
´npm install eslint-plugin-prettier´

###Add extension Prettier ESLint to VS code

####Fixes for existing problems
--babel version propblem, causes warning
´install --save-dev @babel/plugin-proposal-private-property-in-object´

-browserlist problem warning
´npx update-browserslist-db@latest´
