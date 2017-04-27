import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Datetime from 'react-datetime';
import styles from './NewClassForm.css';

class NewClassForm extends Component {

    constructor(props){
        super(props);
        this.state = {name: '', desc: '', date: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.nameInput.focus();
    }

    handleSubmit(event){
        console.log(this.state);
        event.preventDefault();
        this.props.createClass(this.state);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        console.log(value);
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    handleDateChange(moment){
        console.log(moment._d);
        this.setState({
            date: moment._d,
        })
    }

    render() {
        return (
            <div>
                <form className={styles['new-class-form']} onSubmit={this.handleSubmit}>
                    <label> new class </label>
                    {this.props.failedLogin && <div className={styles['login-failed']}>!</div>}
                    <input name="name" className={styles['input']} type="text" placeholder="Name" value={this.state.name} onChange={this.handleChange}
                      ref={(input) => { this.nameInput = input; }} />
                    <input name="desc" className={styles['input']} type="text" placeholder="Description" value={this.state.desc} onChange={this.handleChange} />
                    <Datetime name="times" placeholder="Class Times" value={this.state.date} onChange={this.handleDateChange}/>
                    <input type="submit" className={styles['class-submit'] + ' transition'} value="Submit" />
                </form>


            </div>
        );
  }
}

// Retrieve data from store as props
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