import React, { Component } from 'react';
import '../containers/App.css';


export default class GameBadge extends Component {

    render() {
        const link="http://megaminerAI.com/" + this.props.gameID;
				let bgColor = ''
				// The Background Color of the div should be different based on what the result of the game
				switch(this.props.result) {
					case 'Win':
						bgColor= '#bef5cb'
						break
					case 'Lose':
						bgColor= '#fdaeb7'
						break
					default:
						bgColor= '#cccccc'
						break
				}

        return(
          <div>
            <div style={{ backgroundColor:bgColor }} className="gamebadge-wrapper col-lg-12">

              <div className="gamebadge-info left">
                <h3>{this.props.opponentName}</h3>
              </div>

              <div className="gamebadge-info middle">
                <h3>{this.props.result}</h3>
                <p>{this.props.description}</p>
              </div>

              <div className="gamebadge-info right">
                <a href={link}>
<!--  <img src="../images/visit_link.png" alt="visit_link.png" height="85vh" width="85vw"/>  -->
                <svg width="400" height="180">
                    <rect x="50" y="20" rx="20" ry="20" width="150" height="150"
                    style="fill:red;stroke:black;stroke-width:5;opacity:0.5" />
                 </svg>
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
