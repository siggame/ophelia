import React, { Component } from 'react';
import '../containers/App.css';


export default class GameBadge extends Component {

    render() {
        const link="http://megaminerAI.com/" + this.props.gameID;

        return(
          <div>
            <div className = "gamebadge-wrapper col-lg-12">

              <div className="gamebadge-info left">
                <h3>{this.props.opponentName}</h3>
              </div>

              <div className="gamebadge-info middle">
                <h3>{this.props.result}</h3>
                <p>{this.props.description}</p>
              </div>

              <div className="gamebadge-info right">
                <a href={link}>
                  <img src="../../images/visit_link.png" alt="visit_link.png" height="85vh" width="85vw"/>
                </a>
              </div>

            </div>
          </div>
        );
    }
}


GameBadge.defaultProps={
  opponentName:"",
  result:"",
  description:"",
  gameID:"",
}
