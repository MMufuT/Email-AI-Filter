import React from 'react'
import DatePicker from 'react-datepicker'

const FilterModal = ({
    modalClassName,
    showFilterForm,
    toggleFilterForm,
    selectedSender,
    selectedBeforeDate,
    selectedAfterDate,
    tempSelectedSender,
    setTempSelectedSender,
    tempSelectedBeforeDate,
    setTempSelectedBeforeDate,
    tempSelectedAfterDate,
    setTempSelectedAfterDate,
    applyFilters,
}) => {
    return (
        showFilterForm && (
            <div className={`modal ${modalClassName}`} tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Filter Options</h5>
                            <button
                                type="button"
                                className="close"
                                onClick={() => toggleFilterForm(selectedSender, selectedBeforeDate, selectedAfterDate)}
                            >
                                <span aria-hidden="true">&times</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="sender" className="form-label">
                                        Sender Email Address:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="sender"
                                        value={tempSelectedSender}
                                        onChange={(e) => setTempSelectedSender(e.target.value)}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="mb-3">
                                            <label htmlFor="afterDate" className="form-label">
                                                Sent After:
                                            </label>
                                            <DatePicker
                                                selected={tempSelectedAfterDate}
                                                onChange={(date) => setTempSelectedAfterDate(date)}
                                                className="form-control"
                                                id="afterDate"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="mb-3">
                                            <label htmlFor="beforeDate" className="form-label">
                                                Sent Before:
                                            </label>
                                            <DatePicker
                                                selected={tempSelectedBeforeDate}
                                                onChange={(date) => setTempSelectedBeforeDate(date)}
                                                className="form-control"
                                                id="beforeDate"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Add date pickers for before and after dates */}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => toggleFilterForm(selectedSender, selectedBeforeDate, selectedAfterDate)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                    applyFilters(tempSelectedSender, tempSelectedBeforeDate, tempSelectedAfterDate)
                                }
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}

export default FilterModal
