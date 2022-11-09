// This config allow us to check for new elements in the children of a dom element
const config = {
    subtree: true,
    childList: true
};

// This callback will call the linker function if a load of elements are added to the DOM
const callback = mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            // We don't want to catch our buttons that are added one-by-one else it will cause infinite loop
            if (mutation.addedNodes.length > 1) {
                wfh();
            }
        }
    });
}

// Observe every mutation in the DOM of the commits list or activity list
const observer = new MutationObserver(callback);
let middlePart = document.getElementsByClassName('middlePart').item(0);
if (middlePart) {
    observer.observe(middlePart, config);
}

// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener((changes, area) => {
    console.log(changes);
    if (area === 'local' && changes.wfhColor?.newValue) {
        console.log('updating color');
        wfh();
    }
});

function wfh() {
    const days = document.getElementsByClassName('permalock lock');
    if (document.getElementById('regular_wfh_legend') === null) {
        const td = document.createElement('td');
        td.id = "regular_wfh_legend";
        td.style.width = "180px";

        const wrapperDiv = document.createElement('div');

        const tableCellDiv = document.createElement('div');
        tableCellDiv.style.display = "table-cell";
        tableCellDiv.style.verticalAlign = "middle";

        const vignetteDiv = document.createElement('div');
        vignetteDiv.classList.add("vignette");
        vignetteDiv.style.outline = "1px solid #cacaca";
        chrome.storage.local.get('wfhColor', function(storage) {
            vignetteDiv.style.background = storage.wfhColor ? storage.wfhColor : 'Peachpuff';
        });

        const span = document.createElement('span');
        span.style.display = 'table-cell';
        span.style.verticalAlign = 'middle';
        span.style.paddingLeft = '5px';
        span.innerText = 'Télétravail régulier';

        tableCellDiv.appendChild(vignetteDiv);
        wrapperDiv.appendChild(tableCellDiv);
        wrapperDiv.appendChild(span);
        td.appendChild(wrapperDiv);

        document.querySelector('[name="legend_table"] tbody tr td:nth-child(4)')?.after(td);
    } else {
        chrome.storage.local.get('wfhColor', function(storage) {
            document.querySelector('[name="legend_table"] tbody tr td:nth-child(5) div div div').style.background = storage.wfhColor ? storage.wfhColor : 'Peachpuff';
        });
    }
    if (days.length === 0) {
        return;
    }
    for (let td of days) {
        if (td.getElementsByTagName('span').item(0).innerText === 'Télétravail régulier') {
            chrome.storage.local.get('wfhColor', function(storage) {
                td.style.background = storage.wfhColor ? storage.wfhColor : 'Peachpuff';
                td.style.outline = "1px solid #cacaca";
            });
        }
    }

}