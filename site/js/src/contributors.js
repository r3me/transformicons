var contributors = {

  ui : {

    ghdata : function() {

      function gitHubContributors() {

        var howMany             = 42,
            baseUrl             = 'https://api.github.com/repos/transformicons/transformicons/contributors?per_page=' + howMany + '&callback=?',
            $contributorsOutput = $('#tcons-contributors'),
            $paginationOutput   = $('.tcons-contributors__pagination'),
            paginationClass     = 'tcons-contributors__pagination-link',
            $pager              = $('.tcons-pager');

          if( !localStorage.getItem('pageLoads') ) {
            localStorage.setItem('pageLoads', 0); // page load count
          } else {
            localStorage.setItem('pageLoads', parseInt(localStorage.getItem('pageLoads'), 0) + 1);
          }

          function _listContributors(data) {
            $contributorsOutput.html('');
            var html = '';
            $(data).each(function(i, user){
              html += '<li><a href="'+ user.url.replace('api.','').replace('users/','') +'"><img src="'+ user.avatar_url +'" alt="'+ user.login +'" class="contributor-avatar"></a></li>';
            });
            $contributorsOutput.html(html);
            localStorage.setItem('contribsHtml', html);
            localStorage.setItem('contribsLoaded', true);
          }

          function _listContributorsLocalStorage() {
            $contributorsOutput.html(localStorage.getItem('contribsHtml'));
          }

          function _contribPagination(meta) {
            var link    = meta.Link,
                $output = $paginationOutput;
                $output.html('');

              $(link).each(function(i,item) {
                var text = item[1].rel,
                    url  = item[0],
                    html = "<li><a href=" + url + " class='" + paginationClass + "'>" + text + "</a></li>";
                    $output.append(html);
              });

              _simplifyPager(); // cut down pager
          }

          function _contribPaginationLocalStorage() {
            $paginationOutput.html(localStorage.getItem('contribsPagination'));
          }

          function _paginationTriggers() {
            $('.' + paginationClass).on('click', function(e) {
              e.preventDefault();
              localStorage.removeItem('contribsLoaded');
              var url = $(this).attr('href');
              _getContributors(url);
            });
          }

          function _getContributors(apiUrl) {

            if(localStorage.getItem('contribsLoaded') && localStorage.getItem('pageLoads') <= 20) {
              _listContributorsLocalStorage(); // output contribs from localStorage
              _contribPaginationLocalStorage(); // output contrib pagination from localStorage
              _paginationTriggers(); // handle pagination clicks
            } else {
              localStorage.removeItem('pageLoads');

              $.ajax({
                type: 'GET',
                url: apiUrl,
                async: false,
                contentType: 'application/json',
                dataType: 'jsonp',
                success: function(data){
                  if(data.meta.status != '200') {
                    _throwError(data.meta);
                  } else {
                    _listContributors(data.data); // output contribs
                    _contribPagination(data.meta); // draw pagination
                    _paginationTriggers(); // handle pagination clicks
                  }
                },
                error: function(e) {
                  console.log(e.message);
                }
              });
            }
          }

          function _throwError(data){
            $contributorsOutput.text('Error Loading Contributors...');
          }

          function _simplifyPager(){
            $pager.find('li').each(function() {
              var $itemText = $(this).find('a').text();
              // hide unwanted pagination items
              // replace default text next/prev
              switch($itemText) {
                case 'first':
                  $(this).hide();
                  break;
                case 'last':
                  $(this).hide();
                  break;
                case 'next':
                  $(this).find('a').text('Next');
                  break;
                case 'prev':
                  $(this).find('a').text('Previous');
                  break;
                default:
              }
            });

            localStorage.setItem('contribsPagination', $pager.html());

          }

          // get contributors on landing
          if(window.matchMedia('(min-width: 480px)').matches) {
            _getContributors(baseUrl);
          }

        }

        function gitHubStats(){

          var $parent           = $('.github-data'),
              $dataContributors = $parent.find('.data.contributors'),
              $dataStars        = $parent.find('.data.stars'),
              $dataOpenIssues   = $parent.find('.data.open-issues'),
              baseUrl           = 'https://api.github.com/repos/transformicons/transformicons',
              contribUrl        = baseUrl + '/contributors?per_page=5000&callback=?',
              starsUrl          = baseUrl,
              openIssuesUrl     = baseUrl;

            function _outputData(target, data, localStorageVar) {
              $(target).text(data);

              if(localStorageVar) {
                localStorage.setItem(localStorageVar, data);
              }
            }

            function _grabContributors(url){
              $.ajax({
                type: 'GET',
                url: url,
                async: true,
                contentType: 'application/json',
                dataType: 'jsonp',
                success: function(data){
                  var result = data.data;
                 _outputData($dataContributors, result.length, 'contribStat');
                },
                error: function(e) {
                  console.log(e.message);
                }
              });
            }

            function _grabStars(url){
              $.ajax({
                type: "GET",
                url: url,
                async: true,
                contentType: "application/json",
                dataType: "jsonp",
                success: function(data){
                  var result = data.data;
                  _outputData($dataStars, result.stargazers_count, 'starStat');
                },
                error: function(e) {
                  console.log(e.message);
                }
              });
            }

            function _grabOpenIssues(url){
              $.ajax({
                type: 'GET',
                url: url,
                async: true,
                contentType: 'application/json',
                dataType: 'jsonp',
                success: function(data){
                  var result = data.data;
                  _outputData($dataOpenIssues, result.open_issues_count, 'openIssueStat');
                },
                error: function(e) {
                  console.log(e.message);
                }
              });
            }

            // init
            if(localStorage.getItem('contribsLoaded') && localStorage.getItem('pageLoads') <= 20){
              _outputData($dataContributors,localStorage.getItem('contribStat'));
              _outputData($dataStars,localStorage.getItem('starStat'));
              _outputData($dataOpenIssues,localStorage.getItem('openIssueStat'));
            } else {
              _grabContributors(contribUrl);
              _grabStars(starsUrl);
              _grabOpenIssues(openIssuesUrl);
            }

        }

        gitHubContributors();
        gitHubStats();

    },

    copyright : function(){
      $('.tcons-copyright').text(new Date().getFullYear());
    }

  }

};

contributors.ui.ghdata();
contributors.ui.copyright();
