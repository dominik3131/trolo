import React, {Component} from 'react';
export default class SmallSpinner extends Component {
    render() {
        return (
            <div className="text-center">
                <div className="spinner-grow" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}
