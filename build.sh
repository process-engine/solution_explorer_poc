#!/bin/bash

# Execute npm run build in a folder specified
# by the first parameter; returns to the starting
# location unsing cd's jumpstack.
function buildPackage() {
  cd "${1}"
  npm run build
  cd -
}

# build contracts first
buildPackage "src/SolutionExplorer.Contracts"
buildPackage "src/SolutionExplorer.Repository.Contracts"
buildPackage "src/SolutionExplorer.Service.Contracts"

# build implementations
buildPackage "src/SolutionExplorer.Repository.FileSystem"
buildPackage "src/SolutionExplorer.Repository.ProcessEngine"
buildPackage "src/SolutionExplorer.Service"
