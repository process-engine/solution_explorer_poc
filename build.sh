function buildPackage() {
  cd "$1"
  npm run build
  cd ".."
}

cd src/

# build contracts first
buildPackage "SolutionExplorer.Contracts"
buildPackage "SolutionExplorer.Repository.Contracts"
buildPackage "SolutionExplorer.Service.Contracts"

buildPackage "SolutionExplorer.Repository.ProcessEngine"
buildPackage "SolutionExplorer.Service"
