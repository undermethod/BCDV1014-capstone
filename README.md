# BCDV1014 dApp II - Capstone Project
## Shaun Lerner 101290912 - Rinx Blockchain Betting Pools

### Installation instructions
1. Spin up local blockchain using "ganache-cli -d" or equivalent
1. Optionally:
   1. In a separate shell, navigate to "/rinx-solidity" and perform "npm i"
   1. Run "truffle compile" to ensure successful compilation of .sol file
   1. Run "./node_modules/.bin/solcjs --abi --bin contracts/RinxPool.sol" and move the two generated files to the root
1. Back-end:
   1. In a separate shell, navigate to "/rinx-node" and perform "npm i"
   1. Run "node index" to deploy Contract and launch Express server
1. Front-end:
   1. In a separate shell, navigate to "rinx-react" and perform "npm i"
   1. Run "npm start" to launch website (port 3000 if browser doesn't auto-launch)

### Sequence Diagram
![sequence diagram](https://github.com/undermethod/BCDV1014-capstone/blob/main/documents/sequence-diagram.png?raw=true)

### Class Diagram
![class diagram](https://github.com/undermethod/BCDV1014-capstone/blob/main/documents/class-diagram.png?raw=true)

### Roadmap
- Q3 2021 -> Complete admin interface
- Q4 2021 -> Minimum Viable Product
- Q1 2022 -> Complete feature implementation
- Q2 2022 -> Complete participant UI
- Q3 2022 -> Launch
