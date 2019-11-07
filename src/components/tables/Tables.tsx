import React from 'react';
import TableModel from "../../data-models/TableModel";
import {MDBContainer, MDBRow, MDBCol} from "mdbreact";
import {Link} from "react-router-dom";
import CreateTable from "./CreateTable";

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
            return new Date(b.last_open).getTime() - new Date(a.last_open).getTime();
        })
            .filter((table, index) => (index < 4))
            .every(table =>
                lastTables.push(
                    <MDBCol key={table.id} md="3">
                        <Link to={{
                            pathname: `/table/${table.id}`
                        }}>
                            {table.name}
                            <img src={table.background} className="img-thumbnail" alt=""/>
                        </Link>
                    </MDBCol>)
            );
        if (lastTables.length > 0) {
            return <MDBContainer className="mt-5">
                <MDBRow className="mb-1">
                    <h3><i className="far fa-user"></i> Last Seen</h3>
                </MDBRow>
                <MDBRow className="mb-2">
                    {lastTables}
                </MDBRow>
            </MDBContainer>;
        } else {
            return <div></div>
        }
    }
    privateTables = () => {
        let privateTables: any[];
        privateTables = [];
        this.state.tables.filter(table => table.visibility === 0)
            .every(table =>
                privateTables.push(
                    <MDBCol key={table.id} md="3">
                        <Link to={{
                            pathname: `/table/${table.id}`
                        }}>
                            {table.name}
                            <img src={table.background} className="img-thumbnail" alt=""/>
                        </Link>
                    </MDBCol>)
            );
        if (privateTables.length > 0) {
            return <MDBContainer className="mt-5">
                <MDBRow className="mb-1">
                    <h3><i className="far fa-clock"></i> Private</h3>
                </MDBRow>
                <MDBRow className="mb-2">
                    {privateTables}
                </MDBRow>
            </MDBContainer>;
        } else {
            return <div></div>
        }
    }

    favouriteTables = () => {
        let  favouriteTables: any[];
        favouriteTables = [];
        this.state.tables.filter(table => table.favourite)
            .every(table =>
                favouriteTables.push(
                    <MDBCol key={table.id} md="3">
                        <Link to={{
                            pathname: `/table/${table.id}`
                        }}>
                            {table.name}
                            <img src={table.background} className="img-thumbnail" alt=""/>
                        </Link>
                    </MDBCol>)
            );
        if ( favouriteTables.length > 0) {
            return <MDBContainer className="mt-5">
                <MDBRow className="mb-1">
                    <h3><i className="far fa-star"></i> Favourite</h3>
                </MDBRow>
                <MDBRow className="mb-2">
                    {favouriteTables}
                </MDBRow>
            </MDBContainer>;
        } else {
            return <div></div>
        }
    }

    render() {
        return [
            <CreateTable></CreateTable>,
            this.lastSeenTables(),
            this.privateTables(),
            this.favouriteTables(),
        ]
    }

}
