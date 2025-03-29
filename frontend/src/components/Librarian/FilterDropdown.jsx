// import React from 'react';
// import './FilterDropdown.css';

// const FilterDropdown = ({ statusFilter, setStatusFilter, options }) => {
//   return (
//     <div className="filter-dropdown">
//       <select
//         value={statusFilter}
//         onChange={(e) => setStatusFilter(e.target.value)}
//       >
//         {options.map(option => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default FilterDropdown;


// import React from 'react';
// import './FilterDropdown.css';

// const FilterDropdown = ({ statusFilter, setStatusFilter, options }) => {
//   return (
//     <div className="filter-dropdown">
//       <select
//         value={statusFilter}
//         onChange={(e) => setStatusFilter(e.target.value)}
//       >
//         {options.map(option => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default FilterDropdown;


import React from 'react';
import './FilterDropdown.css';

const FilterDropdown = ({ statusFilter, setStatusFilter, options }) => {
  return (
    <div className="filter-dropdown">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
