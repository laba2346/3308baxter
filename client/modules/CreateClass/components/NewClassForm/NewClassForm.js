import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './NewClassForm.css';

class NewClassForm extends Component {
    constructor(props) {
        super(props);
        this.state = { class_name: '', class_info: '', class_times: '',
            class_color: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.createClass(this.state);

    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    render() {
        return (
            <div>
                <form className={styles['new-assignment-form']} onSubmit={this.handleSubmit}>
                    <label> New Assignment </label>
                    {this.props.failedLogin && <div className={styles['login-failed']}>!</div>}
                    <input name="class_name" className={styles['input']} type="text" placeholder="Name" value={this.state.class_name} onChange={this.handleChange} />
                    <input name="class_info" className={styles['input']} type="text" placeholder="Description" value={this.state.class_info} onChange={this.handleChange} />
                    <input type="submit" className={styles['login-submit'] + ' transition'} value="Submit" />
                </form>
            </div>
        );
    }
}


function mapStateToProps(state) {
  return {
  };
}

NewClassForm.propTypes = {
    login: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    createClass: PropTypes.func.isRequired
};

NewClassForm.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(NewClassForm);
