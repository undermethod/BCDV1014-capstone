### `RinxPool.sol`
Function | Parameters | Visibility | Mutability | Modifiers | Events | Returns | Notes 
-|-|-|-|-|-|-|-
`constructor` | N/A | N/A | N/A | N/A | N/A | N/A | - ensures owner isn't zero address<br/> - deployed only for the lifespan of one pool, to be `selfdestruct`ed at the time of closing
`placeWager` | N/A | `external` | `payable` | N/A | - `PrizeIncreased` | N/A | - adds the `ante` for `msg.sender` to the `wagers` mapping<br/> - increments the `total`
`close` | N/A | `external` | `payable` | `onlyOwner` | - `RinxPoolClosed` | - `address[] winners`<br/> - `uint prize` | - validates permission<br/> - `selfdestruct`s this instance to return prize amount

### `RinxPoolFactory.sol`
Function | Parameters | Visibility | Mutability | Modifiers | Events | Returns | Notes 
-|-|-|-|-|-|-|-
`constructor` | N/A | N/A | N/A | N/A | - `RinxPoolFactoryInit` | N/A | - stays on-chain for opening and closing pools
`createPool` | N/A | `external` | `payable` | N/A | - `RinxPoolOpened` | - `address poolCreated` | - deploys a new instance of RinxPool
`destroyPool` | - `address poolToDestroy` | `external` | `payable` | `onlyOwner` | N/A | - `address[] winners`<br/> - `uint prize` | - validates permission<br/> - forwards prize received from `selfdestruct`ed pool to the winner(s)
