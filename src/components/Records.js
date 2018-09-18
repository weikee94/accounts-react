import React, { Component } from 'react';
import Record from './Record';
import RecordForm from './RecordForm';
import { getJSON } from 'jquery';
import axios from 'axios';
import * as RecordsAPI from '../utils/RecordsAPI';
import AmountBox from './AmountBox';

//https://5ba055ed8c533d0014ea0e5e.mockapi.io/records


class Records extends Component {

    constructor() {
        super();
        this.state = {
            records: [],
            error: null,
            isLoaded: false,
        }
    }

    componentDidMount() {
        // method one jquery getJSON
        // getJSON('https://5ba055ed8c533d0014ea0e5e.mockapi.io/records').then((response) => this.setState({ records: response, isLoaded: true }), error => this.setState({
        //     isLoaded: true,
        //     error
        // }));

        // method two axios
        RecordsAPI.getAll().then((res) => this.setState({
            records: res.data,
            isLoaded: true
        })).catch((error) => this.setState({
            isLoaded: true,
            error
        }))
    }

    addRecord(record) {
        this.setState({
            error: null,
            isLoaded: true,
            records: [
                ...this.state.records,
                record
            ]
        })
    }

    updateRecord(record, data) {
        const recordIndex = this.state.records.indexOf(record);
        const newRecords = this.state.records.map((item, index) => {
            if (index !== recordIndex) {
                return item;
            }

            return {
                ...item,
                ...data
            }
        })

        this.setState({
            records: newRecords
        })
    }

    deleteRecord(record) {
        const recordIndex = this.state.records.indexOf(record);
        const newRecords = this.state.records.filter((item, index) => index !== recordIndex);
        this.setState({
            records: newRecords
        })
    }

    credits() {
        let credits = this.state.records.filter((record) => {
          return record.amount >= 0;
        })
    
        return credits.reduce((prev, curr) => {
          return prev + Number.parseInt(curr.amount, 0)
        }, 0)
      }

    debits() {
        let credits = this.state.records.filter((record) => {
            return record.amount < 0;
        })

        return credits.reduce((prev, curr) => {
            return prev + Number.parseInt(curr.amount, 0)
        }, 0)
    }

    balance() {
        return this.credits() + this.debits();
    }

    render() {
        const { error, isLoaded, records } = this.state;
        let recordsComponent;

        if (error) {
            recordsComponent = <div>Error: {error.message}!</div>
        } else if (!isLoaded) {
            recordsComponent = <div>Loading...</div>
        } else {
            recordsComponent = (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => 
                            <Record key={record.id} record={record} 
                                handleEditRecord={this.updateRecord.bind(this)}
                                handleDeleteRecord={this.deleteRecord.bind(this)}
                            />
                        )}
                    </tbody>
                </table>
            )
        }

        return (
            <div>
                <h2>Records</h2>
                <div className="row mb-3">
                    <AmountBox text="Credit" type="success" amount={this.credits()}/>
                    <AmountBox text="Debit" type="danger" amount={this.debits()}/>
                    <AmountBox text="Balance" type="info" amount={this.balance()}/> 
                </div>
                <RecordForm handleNewRecord={this.addRecord.bind(this)}/>
                {recordsComponent}
            </div>
        )
    }
}

export default Records;
