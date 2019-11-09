import React, {Component} from 'react';
import './Spinner.css'
export default class Spinner extends Component {
    render() {
        return (
            <div className="text-center">
                <div className="spinner-grow spinnerCenter" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}
