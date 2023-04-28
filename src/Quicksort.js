/**
 * Sorting-Algorithm for QuickAccess
 */
export function QuickSort (list, start, end, strategy = "folderposition") {
    var lastMatch;
    if (list.length > 1) {
        lastMatch = quicksort_helper(list, start, end, strategy);
        if (start < lastMatch - 1) {
            QuickSort(list, start, lastMatch - 1, strategy);
        }
        if (lastMatch < end) {
            QuickSort(list, lastMatch, end, strategy);
        }
    }
}

/**
 * Sorting-Algorithm-Helper for QuickAccess
 */
function quicksort_helper (list, start, end, strategy) {
    var pivot = Math.floor((end + start) / 2);
    var pivotElement = getCompareValue(list, pivot, strategy);
    var i = start;
    var j = end;

    while (i <= j) {
        while (getCompareValue(list, i, strategy) < pivotElement) {
            i++;
        }
        while (getCompareValue(list, j, strategy) > pivotElement) {
            j--;
        }
        if (i <= j) {
            swap(list, i, j);
            i++;
            j--;
        }
    }
    return i;
}

/**
 * Sorting-Algorithm-Helper for QuickAccess
 * This method allows easy access to the element which is sorted by.
 */
export function getCompareValue (nodes, int, strategy) {
    if (strategy === 'datemodified') {
        return nodes[int].getAttribute('mtime');
    } else if (strategy === 'alphabet') {
        return nodes[int].getElementsByTagName('span')[0].innerText.toLowerCase()
    }
    // Always return folderPosition for folderposition, date, customorder or anything else
    return nodes[int].getAttribute('folderPosition');
}

/**
 * Sorting-Algorithm-Helper for QuickAccess
 * This method allows easy swapping of elements.
 */
function swap (list, j, i) {
    list[i].before(list[j]);
    list[j].before(list[i]);
}

/**
 * Reverse QuickAccess-List
 */
export function reverseList (list) {
    var len = list.length - 1;
    for (var i = 0; i < len / 2; i++) {
        swap(list, i, len - i);
    }
}