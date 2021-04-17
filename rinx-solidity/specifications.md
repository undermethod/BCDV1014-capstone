### `RinxPool.sol`
Function | Parameters | Visibility | Mutability | Modifiers | Returns | Notes 
-|-|-|-|-|-|-
`constructor` | N/A | N/A | N/A | N/A | N/A | - deployed only for the lifespan of one pool, to be `selfdestruct`ed at the time of closing
`wager` | - `uint ante` | `external` | `payable` | N/A | N/A | - adds the `ante` for `msg.sender` to the `wagers` mapping<br/> - increments the `total`
`close` | N/A | `external` | `payable` | `onlyOwner` | - `address[] winners`<br/> - `uint prize` | - validates permission<br/> - `selfdestruct`s this instance to return prize amount

### `RinxPoolFactory.sol`
Function | Parameters | Visibility | Mutability | Modifiers | Returns | Notes 
-|-|-|-|-|-|-
`constructor` | N/A | N/A | N/A | N/A | N/A | - stays on-chain for opening and closing pools
`createPool` | N/A | `external` | `payable` | N/A | - `address poolCreated` | - deploys a new instance of RinxPool
`destroyPool` | - `address poolToDestroy` | `external` | `payable` | `onlyOwner` | - `address[] winners`<br/> - `uint prize` | - validates permission<br/> - forwards prize received from `selfdestruct`ed pool to the winner(s)
