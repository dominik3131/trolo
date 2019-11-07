import React from 'react';
import TableModel from "../../data-models/TableModel";
import {MDBContainer, MDBRow, MDBCol} from "mdbreact";
import {Link} from "react-router-dom";

interface Props {
}

interface State {
    tables: TableModel[]
}

export default class Tables extends React.Component<Props, State> {

    constructor({props}: { props: any }) {
        super(props);
        this.state = {tables: []};
    }

    componentDidMount(): void {
        fetch('api/tables/').then(res => res.json())
            .then(res => this.setState({tables: res}))
    }

    lastSeenTables = () => {
        let lastTables: any[];
        lastTables = [];
        this.state.tables.sort((a: TableModel, b: TableModel) => {
            return b.last_open - a.last_open;

        })
            .filter((table, index) => (index < 5))
            .every(table => {

                    lastTables.push(
                        <Link to={{
                            pathname: `/table/${table.id}`
                        }}>
                            <MDBCol key={table.id} md="3" onClick={() => this.openTable(table.id)}>
                                {table.name}
                                <img src={table.background} className="img-thumbnail" alt=""/>
                            </MDBCol>
                        </Link>)
                }
            );
        return <MDBContainer className="mt-3">
            <MDBRow className="mb-1">
                <h3><i className="far fa-clock"></i> Last Seen</h3>
            </MDBRow>
            <MDBRow className="mb-2">
                {lastTables}
            </MDBRow>
        </MDBContainer>;
    }
    privateTables = () => {
        let privateTables: any[];
        privateTables = [];
        this.state.tables.filter(table => table.visibility === 0)
            .filter((table, index) => (index < 5))
            .every(table =>
                privateTables.push(
                    <Link to={{
                        pathname: `/table/${table.id}`
                    }}>
                        <MDBCol key={table.id} md="3" onClick={() => this.openTable(table.id)}>
                            {table.name}
                            <img src={table.background} className="img-thumbnail" alt=""/>
                        </MDBCol>
                    </Link>)
            );
        return <MDBContainer className="mt-5">
            <MDBRow className="mb-1">
                <h3><i className="far fa-user"></i> Private</h3>
            </MDBRow>
            <MDBRow className="mb-2">
                {privateTables}
            </MDBRow>
        </MDBContainer>;
    }

    render() {
        return [
            this.lastSeenTables(),
            this.privateTables(),
        ]

    }

    private openTable(id: number) {
        //TODO open table of id given as parameter when table component is created
    }
}
