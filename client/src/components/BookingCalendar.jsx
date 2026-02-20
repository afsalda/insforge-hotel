import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BookingCalendar({ selectedDate, onSelect, minDate }) {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || new Date()));

    const viewYear = currentMonth.getFullYear();
    const viewMonth = currentMonth.getMonth();

    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prevMonth = () => {
        setCurrentMonth(new Date(viewYear, viewMonth - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(viewYear, viewMonth + 1, 1));
    };

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const handleDateClick = (day) => {
        const date = new Date(viewYear, viewMonth, day);
        if (minDate && date < new Date(minDate).setHours(0, 0, 0, 0)) return;
        onSelect(formatDate(date));
    };

    const isSelected = (day) => {
        if (!selectedDate) return false;
        const d = new Date(viewYear, viewMonth, day);
        return formatDate(d) === selectedDate;
    };

    const isPast = (day) => {
        const d = new Date(viewYear, viewMonth, day);
        d.setHours(0, 0, 0, 0);

        const limitDate = minDate ? new Date(minDate) : today;
        limitDate.setHours(0, 0, 0, 0);

        return d < limitDate;
    };

    const isToday = (day) => {
        const d = new Date(viewYear, viewMonth, day);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    };

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const disabled = isPast(d);
        const selected = isSelected(d);
        days.push(
            <div
                key={d}
                className={`calendar-day ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''} ${isToday(d) && !selected ? 'today' : ''}`}
                onClick={() => !disabled && handleDateClick(d)}
            >
                {d}
            </div>
        );
    }

    return (
        <div className="custom-calendar">
            <div className="calendar-header">
                <button onClick={prevMonth} type="button" className="calendar-nav-btn">
                    <ChevronLeft size={20} />
                </button>
                <span className="calendar-month-year">
                    {MONTHS[viewMonth]} {viewYear}
                </span>
                <button onClick={nextMonth} type="button" className="calendar-nav-btn">
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className="calendar-days-header">
                {DAYS.map(d => <div key={d} className="calendar-day-label">{d}</div>)}
            </div>
            <div className="calendar-grid">
                {days}
            </div>
        </div>
    );
}
