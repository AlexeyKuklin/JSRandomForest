// Displaying Decision Tree
// document.getElementById('displayTree').innerHTML = treeToHtml(decisionTree.root);
//<div class="tree" id="displayTree"></div>

//dataset.types[node.column]

'use strict';

function treeToHtml(node, dataset) {
    // only leafs containing category
    if (node.labels) {
        return  ['<ul>',
                    '<li>',
                        '<a href="#">',
                            '<b>', node.labels[0], node.labels[1], '</b>',
                        '</a>',
                    '</li>',
                 '</ul>'].join('');
    }
    
    return  ['<ul>',
                '<li>',
                    '<a href="#">',
                        '<b>', 'tree.attribute', ' ', "==", ' ', node.value, ' ?</b>',
                    '</a>',
                    '<ul>',
                        '<li>',
                            '<a href="#">yes</a>',
                            treeToHtml(node.left, dataset),
                        '</li>',
                        '<li>', 
                            '<a href="#">no</a>',
                            treeToHtml(node.right, dataset),
                        '</li>',
                    '</ul>',
                '</li>',
             '</ul>'].join('');
}

exports.treeToHtml = treeToHtml;