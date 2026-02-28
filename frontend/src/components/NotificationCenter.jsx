import React, { useState } from 'react';

export default function NotificationCenter({ notifications = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const pendingCount = notifications.filter(n => n.status === 'pending').length;

    return (
        <div className="relative">
            <button
                className="icon-text-btn btn-ghost has-badge relative text-xl px-2 hover:text-white transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="material-icon">🔔</span>
                {pendingCount > 0 && (
                    <span className="badge absolute -top-1 -right-1 bg-danger text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {pendingCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-bgCard border border-borderC rounded-lg shadow-xl shadow-black/50 overflow-hidden z-50">
                    <div className="bg-bgInput p-3 border-b border-borderC">
                        <h4 className="font-bold text-sm m-0">Activity Center</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-center text-textMuted text-sm">No new notifications</p>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="p-3 border-b border-borderC/50 hover:bg-white/5 transition-colors text-sm">
                                    <div className="flex gap-2">
                                        <span className="text-primary mt-0.5">
                                            {notif.type === 'request' ? '🔑' : '✨'}
                                        </span>
                                        <div>
                                            <p className="text-textMain m-0">{notif.message}</p>
                                            <span className="text-xs text-textMuted mt-1 block">
                                                {new Date(notif.createdAt).toLocaleDateString()} &middot; <span className={notif.status === 'pending' ? 'text-warning' : 'text-success'}>{notif.status}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
