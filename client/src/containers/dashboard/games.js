import React from 'react';
import GameBadge from "../../components/GameBadge";

export default class Games extends React.Component {
  render() {
    return (
      <div>
        <GameBadge opponentName={"The Voodles"} result={"Win"} description={"Opponent failed to compile"} gameID={"345765356"}/>
        <GameBadge opponentName={"The Doodles"} result={"Lose"} description={"Your AI got wrecked, sorry."} gameID={"345765356"}/>
        <GameBadge opponentName={"The Noodles"} result={"Lose"} description={" Scofdasfdjsaklf dasjfkdjaslf adfsas fdasjfkdlas f;lads fdslkf dsal;jfkdas; fdslasot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot "} gameID={"345765356"}/>
        <GameBadge opponentName={"The Poodles"} result={"Lose"} description={"Your AI got wrecked, sorry."} gameID={"345765356"}/>
        <GameBadge opponentName={"The ScDoodles"} result={"Win"} description={"The reason doesn't matter, you won!"} gameID={"345765356"}/>
        <GameBadge opponentName={"The McNoodles"} result={"Lose"} description={"Your AI got wrecked, sorry. Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot"} gameID={"345765356"}/>
        <GameBadge opponentName={"The Scoodles"} result={"Lose"} description={"Your AI got wrecked, sorry."} gameID={"345765356"}/>
      </div>
    );
  }
}
