import React from 'react';
import Radium from 'radium';

const styles = {
  title: {
    fontSize: '18px',
    color: '#666',
    borderBottom: '1.5px solid rgba(0,0,0,0.12)',
    marginBottom: '10px'
  },
  contactCard : {
    display: 'none',
    '@media (min-width: 740px)': {
      display: 'flex',
      flexDirection: 'column',
      color: '#a99999',
      padding: '10px',
      margin: '10px',
      background: '#fff'
    }
  }
};

class DealContactInfo extends React.Component {

  render() {

    return (
      <div style = {styles.contactCard}
        >
        <div style = {styles.title }>
          Contact Info
        </div>
        Address: c. Almaty, mkr. Mamyr 4, 197A
        <div>Tel:
          +7 (727) 255-58-57
          +7 (778) 668-88-58
        </div>
      </div>
    )
  }
}

export default Radium(DealContactInfo);