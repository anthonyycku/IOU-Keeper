import React from 'react';
import { DebtEntry } from "../../models/bill-tracking.model";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import {
  formatDate,
  formatSenderReceiver,
  pastDueDate,
  renderSenderReceiverColor
} from "../../functions/bill-tracking.functions";
import '../../css/debt-table.css';
import { DebtTableProps } from "./billing-left-pane";

const DebtTable = ({ displayedTableData, selectedRowId, setSelectedRowId, deferredSearch }: DebtTableProps) => {
  const userId = useSelector((state: RootState) => state.auth.userDatabaseId);

  const headerClass = "px-6 py-3"
  const cellClassLong = "px-6 py-4 truncate"

  const filterSearchQuery = (debtItem: DebtEntry) => {
    let userIsSender: boolean = userId === debtItem.sender_id

    return (
      debtItem.amount.toString().includes(deferredSearch!) ||
      debtItem.description.toLowerCase().includes(deferredSearch!.toLowerCase()) ||
      (userIsSender ? (
        debtItem.receiver_data.name.toLowerCase().includes(deferredSearch!.toLowerCase())
      ) : (
        debtItem.sender_data.name.toLowerCase().includes(deferredSearch!.toLowerCase())
      ))
    );
  };

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-left text-sm text-gray-300 border-separate border-spacing-0 table-fixed">
        <thead className="text-xs uppercase bg-gray-50 bg-gray-700 text-white sticky top-0">
        <tr>
          <th scope="col" className={headerClass}>To/From</th>
          <th scope="col" className={headerClass}>Amount</th>
          <th scope="col" className={headerClass}>Description</th>
          <th scope="col" className={headerClass}>Due Date</th>
          <th scope="col" className={headerClass}>Frequency</th>
          <th scope="col" className={headerClass}></th>
        </tr>
        </thead>

        <tbody>
        {displayedTableData.length > 0 && displayedTableData.filter(debtItem => filterSearchQuery(debtItem)).map(debtItem => (

          <tr
            key={debtItem.id}
            onClick={() => setSelectedRowId(debtItem.id)}
            className={`debt-table-row font-medium border-gray-700 hover:bg-gray-500 cursor-pointer ${selectedRowId === debtItem.id && 'bg-gray-600 debt-table-row-selected'} `}
          >

            {/* Name */}
            <th scope="row" className="px-6 py-4 font-medium text-white truncate">
              {formatSenderReceiver(userId!, debtItem.sender_id, debtItem.sender_data, debtItem.receiver_data)}
            </th>

            {/*Amount*/}
            <td
              className={`px-6 py-4 truncate ${renderSenderReceiverColor(userId!, debtItem.sender_id)}`}>
              {`$ ${debtItem.amount}`}
            </td>

            {/*Description*/}
            <td className={cellClassLong}>
              {debtItem.description}
            </td>

            {/*Due Date*/}
            <td className={cellClassLong}>
              <span className={`flex space-x-2 items-center ${pastDueDate(debtItem.next_recurrence_date)}`}>
                <p>{formatDate(debtItem.next_recurrence_date)}</p>
                {pastDueDate(debtItem.next_recurrence_date) && <i className="fa fa-exclamation-triangle"/>}
              </span>
            </td>

            {/*Frequency*/}
            <td className={cellClassLong}>
            </td>

            {/*Complete*/}
            <td className={`pl-12`}>
              <button className="hover:text-green-500" onClick={e => e.stopPropagation()}>
                <i className="fa fa-check-circle-o" style={{ fontSize: '1.5rem', margin: 0 }}></i>
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
};

export default DebtTable;