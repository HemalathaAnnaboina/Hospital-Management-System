import React from 'react';
import { Inbox } from 'lucide-react';

const DataTable = ({ columns, data, emptyMessage = 'No records found' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <Inbox size={42} />
        <h4>{emptyMessage}</h4>
        <p>There is currently no data matching this request.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={col.width ? { width: col.width } : {}}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
