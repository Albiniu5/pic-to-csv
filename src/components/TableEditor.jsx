import React, { useState, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, GripHorizontal } from 'lucide-react';

// --- Sortable Header Component ---
function SortableHeader({ id, value, onRename, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <th
            ref={setNodeRef}
            style={style}
            className="p-2 border-b border-slate-200 min-w-[150px] bg-slate-50 relative group"
        >
            <div className="flex items-center gap-1 group/header">
                {/* Drag Handle */}
                <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-indigo-600 p-1 flex-shrink-0">
                    <GripVertical size={14} />
                </div>

                {/* Editable Header Input */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onRename(id, e.target.value)}
                    className="flex-1 bg-transparent font-semibold uppercase text-xs text-slate-700 tracking-wider outline-none border-b border-transparent focus:border-indigo-500 hover:bg-slate-100 px-1 py-1 rounded transition-colors"
                />

                {/* Delete Button */}
                <button
                    onClick={onDelete}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover/header:opacity-100 transition-opacity p-1"
                    title="Delete Column"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </th>
    );
}

// --- Sortable Row Component ---
function SortableRow({ id, rowData, columns, onCellChange, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 'auto',
        position: 'relative',
    };

    return (
        <tr ref={setNodeRef} style={style} className="hover:bg-indigo-50/30 transition-colors bg-white group/row">
            {/* Row Drag Handle */}
            <td className="w-10 border-r border-slate-100 p-2 text-center bg-slate-50">
                <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-indigo-600 flex justify-center p-2">
                    <GripHorizontal size={16} />
                </div>
            </td>

            {/* Data Cells */}
            {columns.map((col) => (
                <td key={col} className="p-0 border-r border-slate-100 last:border-r-0">
                    <input
                        type="text"
                        value={rowData[col] || ''}
                        onChange={(e) => onCellChange(id, col, e.target.value)}
                        className="w-full h-full p-3 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all font-mono text-sm text-slate-700"
                    />
                </td>
            ))}

            {/* Row Delete Button */}
            <td className="w-10 border-l border-slate-100 p-2 text-center relative">
                <button
                    onClick={onDelete}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                    title="Delete Row"
                >
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
}

// --- Main Editor Component ---
export default function TableEditor({ initialData, tableName, onUpdate }) {
    // Use ref to track if we've initialized to prevent re-initialization loops
    const hasInitialized = React.useRef(false);

    // Lazy initialize columns and rows ONCE
    const [columns, setColumns] = React.useState(() => {
        if (initialData && initialData.length > 0) {
            return Object.keys(initialData[0]);
        }
        return [];
    });

    const [rows, setRows] = React.useState(() => {
        if (initialData && initialData.length > 0) {
            hasInitialized.current = true;
            return initialData.map((row, index) => ({ ...row, _id: `row-${index}` }));
        }
        return [];
    });

    // Sync changes back to parent ONLY when local state changes (not on initial load)
    React.useEffect(() => {
        // Skip if not initialized or if this is the first render
        if (!hasInitialized.current || columns.length === 0 || rows.length === 0) {
            hasInitialized.current = true;
            return;
        }

        console.log("🔄 TableEditor syncing to parent. Column order:", columns.join(" → "));

        // Reorganize data to match current column order
        const reorganizedData = rows.map(({ _id, ...row }) => {
            const orderedRow = {};
            // Rebuild each row object in the current column order
            columns.forEach(col => {
                orderedRow[col] = row[col];
            });
            return orderedRow;
        });

        onUpdate({ name: tableName, data: reorganizedData });
    }, [rows, columns]); // Only trigger on LOCAL state changes, not on tableName or onUpdate

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // --- Handlers ---

    // RENAME COLUMN HANDLER
    const handleColumnRename = (oldName, newName) => {
        if (oldName === newName) return;

        // 1. Update Columns Array (maintain order)
        setColumns(prev => prev.map(c => c === oldName ? newName : c));

        // 2. Migrate Data in all Rows (preserve values under new key)
        setRows(prev => prev.map(row => {
            const newRow = { ...row };
            newRow[newName] = newRow[oldName]; // Copy value to new key
            delete newRow[oldName];            // Remove old key
            return newRow;
        }));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        // Handle Column Reorder
        if (columns.includes(active.id) && columns.includes(over.id)) {
            if (active.id !== over.id) {
                setColumns((items) => {
                    const oldIndex = items.indexOf(active.id);
                    const newIndex = items.indexOf(over.id);
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
            return;
        }

        // Handle Row Reorder
        const activeRow = rows.find(r => r._id === active.id);
        const overRow = rows.find(r => r._id === over.id);

        if (activeRow && overRow && active.id !== over.id) {
            setRows((items) => {
                const oldIndex = items.findIndex((i) => i._id === active.id);
                const newIndex = items.findIndex((i) => i._id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleCellChange = (rowKeywordsId, colKey, value) => {
        setRows((prev) =>
            prev.map((row) =>
                row._id === rowKeywordsId ? { ...row, [colKey]: value } : row
            )
        );
    };

    const addColumn = () => {
        const newColName = `New Column ${columns.length + 1}`;
        setColumns([...columns, newColName]);
        // Rows automatically handle missing keys as empty in render, OR we can explicit add:
        setRows(prev => prev.map(r => ({ ...r, [newColName]: "" })));
    };

    const deleteColumn = (colToDelete) => {
        if (columns.length <= 1) return; // Prevent deleting last column
        setColumns(columns.filter(c => c !== colToDelete));
        setRows(rows.map(row => {
            const newRow = { ...row };
            delete newRow[colToDelete];
            return newRow;
        }));
    };

    const addRow = () => {
        const newRow = { _id: `row-new-${Date.now()}` };
        columns.forEach(col => newRow[col] = "");
        setRows([...rows, newRow]);
    };

    const deleteRow = (idToDelete) => {
        setRows(rows.filter(r => r._id !== idToDelete));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-8">

                {/* Table Toolbar */}
                <div className="p-4 border-b border-slate-100 flex justify-end gap-2 bg-slate-50">
                    <button onClick={addColumn} className="text-xs flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition">
                        <Plus size={14} /> Add Column
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                            <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
                                <tr>
                                    <th className="w-10 border-b border-slate-200"></th>{/* Row Drag Handle Header */}
                                    {columns.map((col) => (
                                        <SortableHeader
                                            key={col}
                                            id={col}
                                            value={col}
                                            onRename={handleColumnRename}
                                            onDelete={() => deleteColumn(col)}
                                        />
                                    ))}<th className="w-10 border-b border-slate-200"></th>{/* Row Delete Header */}
                                </tr>
                            </SortableContext>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            <SortableContext items={rows.map(r => r._id)} strategy={verticalListSortingStrategy}>
                                {rows.map((row) => (
                                    <SortableRow
                                        key={row._id}
                                        id={row._id}
                                        rowData={row}
                                        columns={columns}
                                        onCellChange={handleCellChange}
                                        onDelete={() => deleteRow(row._id)}
                                    />
                                ))}
                            </SortableContext>
                        </tbody>
                    </table>
                </div>

                {/* Footer Actions */}
                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                    <button onClick={addRow} className="w-full py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors text-sm font-medium border-2 border-dashed border-transparent hover:border-indigo-200">
                        <Plus size={16} /> Add Row
                    </button>
                </div>

            </div>
        </DndContext>
    );
}
