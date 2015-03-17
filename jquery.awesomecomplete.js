/**
 * Awesomecomplete — A lightweight, simple autocomplete plugin
 *  Clint Tseng (clint@dontexplain.com) — 2009-08-20
 *    I think licenses are dumb and superfluous. I'm releasing this into the
 *    wild under public domain, but please do let me know what you think!
 */

(function($)
{
    var ident = 0,
        scrollIntoView = ('scrollIntoView' in document.createElement('li'));

    // Initializer. Call on a text field to make things go.
    $.fn.awesomecomplete = function(options)
    {
        var options = $.extend({}, $.fn.awesomecomplete.defaults, options);

        return this.each(function()
        {
            var $this = $(this);
            var config = $.meta ? $.extend({}, options, $this.data()) : options;
            $this.data('awesomecomplete-config', config);

            var $attachTo = $(config.attachTo || $this);
            var $list = $('<ul/>');
            if (!config.wrapSuggestions) {
                $list.insertAfter($attachTo);
            } else {
                $list.appendTo($attachTo);
            }
            $list.hide()
                .addClass(config.suggestionListClass)
                .css('width', $attachTo.innerWidth());
            $this.data('awesomecomplete-list', $list);

            var typingDelayPointer;
            var suppressKey = false;
            $this.keyup(function(event)
            {
                if (suppressKey)
                {
                    suppressKey = false;
                    return;
                }

                // ignore arrow keys, shift
                if ( ((event.which > 36) && (event.which < 41)) ||
                     (event.which == 16) )
                    return;

                if (config.typingDelay > 0)
                {
                    clearTimeout(typingDelayPointer);
                    typingDelayPointer = setTimeout(function() { processInput($this); }, config.typingDelay);
                }
                else
                {
                    processInput($this);
                }
            });

            $this.keydown(function(event)
            {
                // enter = 13; up = 38; down = 40; esc = 27
                var $active = $list.children('li.' + config.activeItemClass);
                if (typeof config.beforeKeyAction === 'function')
                    config.beforeKeyAction($active.get(), event);

                switch (event.which)
                {
                    case 13:
                        if (($active.length !== 0) && ($list.is(':visible')))
                        {
                            event.preventDefault();
                            $this.val($active.data('awesomecomplete-value'));
                            config.onComplete($active.data('awesomecomplete-dataItem'));
                            $list.hide();
                        }
                        $list.hide();
                        suppressKey = true;
                        break;
                    case 38:
                        event.preventDefault();
                        if ($active.length === 0)
                        {
                            $list.children('li:last-child').addClass(config.activeItemClass);
                        }
                        else
                        {
                            $active.prev().addClass(config.activeItemClass);
                            $active.removeClass(config.activeItemClass);
                        }
                        break;
                    case 40:
                        event.preventDefault();
                        if ($active.length === 0)
                        {
                            $list.children('li:first-child').addClass(config.activeItemClass);
                        }
                        else if ($active.is(':not(:last-child)'))
                        {
                            $active.next().addClass(config.activeItemClass);
                            $active.removeClass(config.activeItemClass);
                        }
                        break;
                    case 27:
                        $list.hide();
                        suppressKey = true;
                        break;
                }
                if (scrollIntoView && $list.is(':visible')) {
                    var $active = $list.children('li.' + config.activeItemClass);
                    if ($active.length > 0) {
                        $active.get(0).scrollIntoView(false);
                    }
                }

                if (typeof config.afterKeyAction === 'function')
                    config.afterKeyAction($active.get(), event);
            });

	    // opera wants keypress rather than keydown to prevent the form submit
            $this.keypress(function(event)
            {
                var $active = $list.children('li.' + config.activeItemClass);

		if ((event.which == 13) && ($list.children('li.' + config.activeItemClass).length > 0))
		{
		    event.preventDefault();
		}
	    });

            // stupid hack to get around loss of focus on mousedown
            var mouseDown = false;
            var blurWait = false;
            $(document).bind('mousedown.awesomecomplete' + ++ident, function()
            {
                mouseDown = true;
            });
            $(document).bind('mouseup.awesomecomplete' + ident, function()
            {
                mouseDown = false;
                if (blurWait)
                {
                    blurWait = false;
                    $list.hide();
                }
            });
            $this.blur(function()
            {
                if (mouseDown)
                {
                    blurWait = true;
                }
                else
                {
                    var $active = $list.children('li.' + config.activeItemClass);
                    if ($list.is(':visible') && ($active.length !== 0))
                        $this.val($active.data('awesomecomplete-value'));
                    $list.hide();
                }
            });
            $this.focus(function()
            {
                if ($list.children(':not(.' + config.noResultsClass + ')').length > 0)
                    $list.show();
            });
        });
    };

    // Data callback.  If you're using callbacks to a server,
    // call this on the autocompleted text field to complete the
    // callback process after you have your matching items.
    var onDataProxy = function($this, term)
    {
        return function(data)
        {
            processData($this, data, term);
        };
    }

// private helpers
    var processInput = function($this)
    {
        var term = $this.val();
        if (typeof $this.data('awesomecomplete-config').dataMethod === 'function')
            $this.data('awesomecomplete-config').dataMethod(term, $this, onDataProxy($this, term));
        else
            processData($this, $this.data('awesomecomplete-config').staticData, term);
    };

    var processData = function($this, data, term)
    {
        var $list = $this.data('awesomecomplete-list');
        $list.empty().hide();
        if (term === '')
            return;

        var config = $this.data('awesomecomplete-config');

        var results = [];
        for (var item = 0; item < data.length; item++)
        {
            var dataItem = jQuery.extend({}, data[item]);
            var matchCount = 0;

            var maxFieldMatches = 0;
            var topMatch = null;
            var matchedTerms = [];

            for (var field in dataItem)
            {
                if ((typeof dataItem[field] === 'function') || (typeof dataItem[field] === 'object'))
                    continue;

                var skippedField = false;
                for (var j = 0; j < config.dontMatch.length; j++)
                    if (field == config.dontMatch[j])
                        skippedField = true;
                if (skippedField)
                    continue;

                var dataString = dataItem[field].toString();
                var terms = [ term ];
                if (config.splitTerm)
                    terms = term.split(config.wordDelimiter);

                for (var j = 0; j < terms.length; j++)
                {
                    if (terms[j] === '')
                        continue;

                    terms[j] = terms[j].replace(/([\\*+?|{}()^$.#])/g, '\\$1');
                    var regex = new RegExp('(' + terms[j] + ')', (config.ignoreCase ? 'ig' : 'g'));

                    var matches = [];
                    if (matches = dataString.match(regex))
                    {
                        matchCount += matches.length;

                        if ((field != config.nameField) && (matches.length > maxFieldMatches))
                        {
                            maxFieldMatches = matches.length;
                            topMatch = field;
                            matchedTerms[j] = true;
                        }
                    }
                }

                if (config.highlightMatches)
                {
                    var regex = new RegExp('(' + terms.join('|') + ')', (config.ignoreCase ? 'ig' : 'g'));
                    dataItem[field] = dataString.replace(regex, '<span class="' + config.highlightClass + '">$1</span>');
                }
            }

            var matchedTermCount = 0;
            for (var j = 0; j < matchedTerms.length; j++)
                if (matchedTerms[j] === true)
                    matchedTermCount++;

            if (matchCount > 0)
                results.push({
                    dataItem: dataItem,
                    originalDataItem: data[item],
                    matchCount: matchCount,
                    topMatch: topMatch,
                    matchedTermCount: matchedTermCount
                });
        }

        results.sort(function(a, b)
        {
            return config.sortFunction(a, b, term);
        });

        results = results.slice(0, config.resultLimit);

        for (var i in results)
        {
            $('<li>' + config.renderFunction(results[i].dataItem, results[i].topMatch, results[i].originalDataItem, config) + '</li>')
				.data('awesomecomplete-dataItem', results[i].originalDataItem)
                .data('awesomecomplete-value', config.valueFunction(results[i].originalDataItem, config))
                .appendTo($list)
                .click(function()
                {
                    var $listItem = $(this);
                    $this.val($listItem.data('awesomecomplete-value'));
                    config.onComplete($listItem.data('awesomecomplete-dataItem'));
                })
                .mouseover(function()
                {
                    $(this).addClass(config.activeItemClass)
                           .siblings().removeClass(config.activeItemClass);
                });
        }

        if ((config.noResultsMessage !== undefined) && (results.length == 0))
            $list.append($('<li class="' + config.noResultsClass + '">' + config.noResultsMessage + '</li>'));

        if ((results.length > 0) || (config.noResultsMessage !== undefined))
            $list.show();
    };

// default functions
    var defaultRenderFunction = function(dataItem, topMatch, originalDataItem, config)
    {
        if ((topMatch === config.nameField) || (topMatch === null))
            return '<p class="title">' + dataItem[config.nameField] + '</p>';
        else
            return '<p class="title">' + dataItem[config.nameField] + '</p>' +
                   '<p class="matchRow"><span class="matchedField">' + topMatch + '</span>: ' +
                        dataItem[topMatch] + '</p>';
    };

    var defaultValueFunction = function(dataItem, config)
    {
        return dataItem[config.nameField];
    };

    var defaultSortFunction = function(a, b, term)
    {
        return (a.matchedTermCount == b.matchedTermCount) ?
               (b.matchCount - a.matchCount) :
               (b.matchedTermCount - a.matchedTermCount);
    };

    $.fn.awesomecomplete.defaults = {
        activeItemClass: 'active',
        attachTo: undefined,
        wrapSuggestions: false,
        dataMethod: undefined,
        dontMatch: [],
        highlightMatches: true,
        highlightClass: 'match',
        ignoreCase: true,
        nameField: 'name',
        noResultsClass: 'noResults',
        noResultsMessage: undefined,
        onComplete: function(dataItem) {},
        sortFunction: defaultSortFunction,
        splitTerm: true,
        staticData: [],
        suggestionListClass: "autocomplete",
        renderFunction: defaultRenderFunction,
        resultLimit: 10,
        typingDelay: 0,
        valueFunction: defaultValueFunction,
        wordDelimiter: /[^\da-z]+/ig
    };
})(jQuery);
