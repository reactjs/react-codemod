#!/bin/sh

echo "\n\nRenaming files from .jsx to .js"
find "$1" -name "*.jsx" -exec sh -c 'mv "$1" "${1%.jsx}.js"' _ {} \;

echo "\n\nResolving relative imports"
jscodeshift -t transforms/resolve-relative-imports.js --extensions js $1

echo "\n\nCleaning up Helmet imports"
jscodeshift -t transforms/convert-helmet-import.js --extensions js $1

echo "\n\nConverting to Radium"
jscodeshift -t transforms/convert-to-radium.js --extensions js $1

echo "\n\nRemoving Gridiron imports"
jscodeshift -t transforms/remove-gridiron-import.js --extensions js $1

echo "\n\nRemoving Stilr stylesheets"
jscodeshift -t transforms/remove-stilr.js --extensions js $1

echo "\n\nMarking index files for deletion"
for line in $(cat empty_indexes.txt); do
	if [ ! -z "$line" ]; then
		if [ -f "$line" ]; then
			mv -i "${line}" "${line/index.js/delete.index.js}"
		fi
	fi
done

rm empty_indexes.txt