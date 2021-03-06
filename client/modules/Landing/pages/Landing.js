import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Description from '../components/Description/Description';
import SignUp from '../components/SignUp/SignUp';
import Header from '../components/Header/Header';

import {sendLoginRequest, sendSignUpRequest, checkIfFieldsValid} from '../LandingActions';

import styles from './Landing.css'

class Landing extends Component {
    constructor(props){
        super(props);
        this.signUp = this.signUp.bind(this);
        this.login = this.login.bind(this);
    }

    login(formState){
        this.props.dispatch(sendLoginRequest(formState));
    }

    signUp = function(formState){
        // check field to determine if valid
        if(this.props.dispatch(checkIfFieldsValid(formState))){
            this.props.dispatch(sendSignUpRequest(formState));
        }
        else{
            console.log('failed to send to serv');
        }
    }

    render() {
        return (
            <div>
                <Header login={this.login} />
            <div className={styles['landing-container']}>
                <div className={styles['DescriptionContainer']}>
                    <Description />
                </div>
                <div className={styles['SignUpContainer']}>
                    <SignUp
                        signUp={this.signUp}
                    />
                    
                </div>
            </div>
            </div>
        );
    }
}

// Retrieve data from store as props
function mapStateToProps(state) {
    return {
    };
}

Landing.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Landing);
