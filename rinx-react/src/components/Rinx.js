import React from "react";
import { NotificationManager } from "react-notifications";
import { nanoid } from "nanoid";
import { doFetchLatest, doFetchPrize, doPostWager } from "../express-interaction";

class Rinx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      games: [],
      prize: null,
      ante: 0
    };
  }

  refresh = async () => {
    this.setState({ loading: true });
    const resLatest = await doFetchLatest();
    console.log(resLatest.games);
    const resPrize = await doFetchPrize();
    console.log(resPrize);
    this.setState({
      loading: false,
      games: resLatest.games,
      prize: resPrize.prize
    });
    if (resLatest.games || resPrize.prize > 0) {
      NotificationManager.info("Refreshed", "Info", 3000);
    }
  }

  componentDidMount = async () => {
    // this.refresh();
  }
  
  // handleSubmitRefresh = async (ev) => {
  //   ev.preventDefault();
  //   this.setState({ loading: true });
  //   const res = await doPost();
  //   console.log(res);
  //   this.setState({
  //     loading: false
  //   });

  //   if () NotificationManager.success("Done refresh", "Success", 3000);
  // }

  handleSubmitWager = async (ev) => {
    ev.preventDefault();
    this.setState({ loading: true });
    const res = await doPostWager(this.state.ante);
    console.log(res);
    this.setState({
      loading: false,
      prize: res.prize,
      ante: 0
    });

    if (res.prize > 0) {
      NotificationManager.success("Done wager, updated prize", "Success", 3000);
    }
  }

  render() {
    return <>
      <div>
        <button
          type="button"
          onClick={(ev) => {
            ev.preventDefault();
            this.refresh();
          }}
        >
          Refresh
        </button>

        <div>
          {this.state.games.length < 1 ? "" : (
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Datetime</th>
                  <th style={{width: "16px"}}></th>
                  <th colSpan={2}>Away</th>
                  <th>@</th>
                  <th colSpan={2}>Home</th>
                </tr>
              </thead>
              <tbody>
                {this.state.games.map(g => (
                  <tr key={nanoid()}>
                    <td>{g.status.detailedState}</td>
                    <td>{new Date(g.gameDate).toLocaleString()}</td>
                    <td></td>
                    <td>{g.teams.away.score}</td>
                    <td>{g.teams.away.team.name}</td>
                    <td>@</td>
                    <td>{g.teams.home.team.name}</td>
                    <td>{g.teams.home.score}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot></tfoot>
            </table>
          )}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={async (ev) => {
            ev.preventDefault();
            this.setState({ loading: true });
            const res = await doFetchPrize();
            console.log(res);
            this.setState({
              loading: false,
              prize: res.prize
            });
          }}
        >
          Check Prize
        </button>
        {!(this.state.prize) ? "" : (
          <div>
            Current prize: {this.state.loading ? "(loading...)" : `${this.state.prize / 1e18} ETH`}
          </div>
        )}
      </div>

      <form
        onSubmit={this.handleSubmitWager}
      >
        {this.state.games.length < 1 ? "" : (<>
          <p></p>
          Ante:
          <input
            type="number"
            autoComplete="ignore"
            value={this.state.loading ? "" : this.state.ante}
            onChange={(ev) => this.setState({ ante: ev.target.value })}
          />
          ETH
          <button
            type="submit"
            disabled={this.state.ante <= 0}
          >
            Place Wager
          </button>
        </>)}
      </form>
    </>;
  }
}

export default Rinx;