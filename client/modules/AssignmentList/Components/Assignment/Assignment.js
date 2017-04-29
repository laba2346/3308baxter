import React, { PropTypes, Component } from 'react';
import styles from './Assignment.css';
import { connect } from 'react-redux';
import moment from 'moment';


class Assignment extends Component {
    constructor(props){
        super(props);
        this.state = {
            optionsShown: false
        };
        this.showHide = this.showHide.bind(this);
        this.delete = this.delete.bind(this);
    }

    showHide () {
        if(this.state.optionsShown){
            this.setState({ optionsShown: false })
        }
        else{
            this.setState({ optionsShown: true })
        }
    }

    delete(id){
        this.props.handleDelete(id);
    }

    render() {
        var date = new Date(this.props.assignment.assignment_due);
        var time = moment(date).format(" h:mm a");
        return (
            <div>
                <div className={this.state.optionsShown ? styles['assignment'] + ' ' + styles['extend'] : styles['assignment'] + ' ' +  styles['default']} >
                    <div className={styles['assignment-text-container']} onClick={this.showHide}>
                        {this.props.assignment.assignment_name}
                        <label className={styles['time-label']}> {time} </label>
                    </div>
                    <div className={this.state.optionsShown ? styles['options'] + ' ' + styles['shown']  : styles['options'] + ' ' + styles['hidden']}>
                        <div className={this.state.optionsShown ? styles['block'] + ' ' + styles['shown'] + ' ' + styles['complete']  : styles['complete'] + ' ' + styles['hidden']} onClick={() => this.delete(this.props.assignment.id)}>
                            <div className={this.state.optionsShown ? styles['checkmark'] + ' ' + styles['shown'] : styles['pencil'] + ' ' + styles['hidden']}>
                            </div>
                        </div>
                        <div className={ this.state.optionsShown ? styles['block'] + ' ' + styles['shown'] + ' ' + styles['edit']  : styles['edit'] + ' ' + styles['hidden']}>
                            <div className={this.state.optionsShown ? styles['pencil'] + ' ' + styles['shown'] : styles['pencil'] + ' ' + styles['hidden']}>
                            </div>
                        </div>
                        <div className={this.state.optionsShown ? styles['block'] + ' ' + styles['shown'] + ' ' + styles['delete']  : styles['delete'] + ' ' + styles['hidden']} onClick={() => this.delete(this.props.assignment.id)}>
                            <div className={this.state.optionsShown ? styles['bin'] + ' ' + styles['shown'] : styles['bin'] + ' ' + styles['hidden']}>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
    };
}
Assignment.propTypes = {
    assignment: PropTypes.object.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

Assignment.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(Assignment);
