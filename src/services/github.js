(function($) {
$.fn.lifestream.feeds.github = function( config, callback ) {

  var template = $.extend({},
    {
      commitCommentEvent: 'commented on <a href="http://github.com/'
      + '${status.repo.name}">${status.repo.name}</a> '
      + '<em>${status.fuzzy_date}</em>',
      createBranchEvent: 'created branch <a href="http://github.com/'
      + '${status.repo.name}/tree/${status.payload.ref}">'
      + '${status.payload.ref}</a> at <a href="http://github.com/'
      + '${status.repo.name}">${status.repo.name}</a> '
      + '<em>${status.fuzzy_date}</em>',
      createRepositoryEvent: 'created repository <a href="http://github.com/'
      + '${status.repo.name}">${status.repo.name}</a> '
      + '<em>${status.fuzzy_date}</em>',
      createTagEvent: 'created tag <a href="http://github.com/'
      + '${status.repo.name}/tree/${status.payload.ref}">'
      + '${status.payload.ref}</a> at <a href="http://github.com/'
      + '${status.repo.name}">${status.repo.name}</a> '
      + '<em>${status.fuzzy_date}</em>',
      deleteBranchEvent: 'deleted branch ${status.payload.ref} at '
      + '<a href="http://github.com/${status.repo.name}">'
      + '${status.repo.name}</a> <em>${status.fuzzy_date}</em>',
      deleteTagEvent: 'deleted tag ${status.payload.ref} at '
      + '<a href="http://github.com/${status.repo.name}">'
      + '${status.repo.name}</a> <em>${status.fuzzy_date}</em>',
      followEvent: 'started following <a href="http://github.com/'
      + '${status.payload.target.login}">${status.payload.target.login}</a> '
      + '<em>${status.fuzzy_date}</em>',
      forkEvent: 'forked <a href="http://github.com/${status.repo.name}">'
      + '${status.repo.name}</a> <em>${status.fuzzy_date}</em>',
      gistEvent: '${status.payload.action} gist '
      + '<a href="http://gist.github.com/${status.payload.gist.id}">'
      + '${status.payload.gist.id}</a> <em>${status.fuzzy_date}</em>',
      issueCommentEvent: 'commented on issue <a href="http://github.com/'
      + '${status.repo.name}/issues/${status.payload.issue.number}">'
      + '${status.payload.issue.number}</a> on <a href="http://github.com/'
      + '${status.repo.name}">${status.repo.name}</a> '
      + '<em>${status.fuzzy_date}</em>',
      issuesEvent: '${status.payload.action} issue '
      + '<a href="http://github.com/${status.repo.name}/issues/'
      + '${status.payload.issue.number}">${status.payload.issue.number}</a> '
      + 'on <a href="http://github.com/${status.repo.name}">'
      + '${status.repo.name}</a> <em>${status.fuzzy_date}</em>',
      pullRequestEvent: '${status.payload.action} pull request '
      + '<a href="http://github.com/${status.repo.name}/pull/'
      + '${status.payload.number}">${status.payload.number}</a> on '
      + '<a href="http://github.com/${status.repo.name}">'
      + '${status.repo.name}</a> <em>${status.fuzzy_date}</em>',
      pushEvent: 'pushed to <a href="http://github.com/${status.repo.name}'
      + '/tree/${status.payload.ref}">${status.payload.ref}</a> at '
      + '<a href="http://github.com/${status.repo.name}">'
      + '${status.repo.name}</a> <em>${status.fuzzy_date}</em>',
      watchEvent: 'started watching <a href="http://github.com/'
      + '${status.repo.name}">${status.repo.name}</a> '
      + '<em>${status.fuzzy_date}</em>'
    },
    config.template),

  parseGithubStatus = function( status ) {
    
    // Depends on moment.js
    if (status.created_at) {
      status.fuzzy_date = moment(status.created_at).fromNow();
    }

    if (status.type === 'CommitCommentEvent' ) {
      return $.tmpl( template.commitCommentEvent, {status: status} );
    }
    else if (status.type === 'CreateEvent'
          && status.payload.ref_type === 'branch') {
      return $.tmpl( template.createBranchEvent, {status: status} );
    }
    else if (status.type === 'CreateEvent'
          && status.payload.ref_type === 'repository') {
      return $.tmpl( template.createRepositoryEvent, {status: status} );
    }
    else if (status.type === 'CreateEvent'
          && status.payload.ref_type === 'tag') {
      return $.tmpl( template.createTagEvent, {status: status} );
    }
    else if (status.type === 'DeleteEvent'
          && status.payload.ref_type === 'branch') {
      return $.tmpl( template.deleteBranchEvent, {status: status} );
    }
    else if (status.type === 'DeleteEvent'
          && status.payload.ref_type === 'tag') {
      return $.tmpl( template.deleteTagEvent, {status: status} );
    }
    else if (status.type === 'FollowEvent' ) {
      return $.tmpl( template.followEvent, {status: status} );
    }
    else if (status.type === 'ForkEvent' ) {
      return $.tmpl( template.forkEvent, {status: status} );
    }
    else if (status.type === 'GistEvent' ) {
      if (status.payload.action === 'create') {
        status.payload.action = 'created'
      } else if (status.payload.action === 'update') {
        status.payload.action = 'updated'
      }
      return $.tmpl( template.gistEvent, {status: status} );
    }
    else if (status.type === 'IssueCommentEvent' ) {
      return $.tmpl( template.issueCommentEvent, {status: status} );
    }
    else if (status.type === 'IssuesEvent' ) {
      return $.tmpl( template.issuesEvent, {status: status} );
    }
    else if (status.type === 'PullRequestEvent' ) {
      return $.tmpl( template.pullRequestEvent, {status: status} );
    }
    else if (status.type === 'PushEvent' ) {
      status.payload.ref = status.payload.ref.split('/')[2];
      return $.tmpl( template.pushEvent, {status: status} );
    }
    else if (status.type === 'WatchEvent' ) {
      return $.tmpl( template.watchEvent, {status: status} );
    }
  },

  parseGithub = function( input ) {
    var output = [], i = 0, j;

    if (input.query && input.query.count && input.query.count >0) {
      j = input.query.count;
      for ( ; i<j; i++) {
        var status = input.query.results.json[i].json;
        output.push({
          date: new Date(status.created_at),
          config: config,
          html: parseGithubStatus(status),
          url: 'https://github.com/' + config.user
        });
      }
    }

    return output;

  };

  $.ajax({
    url: $.fn.lifestream.createYqlUrl('select '
      + 'json.type, json.actor, json.repo, json.payload, json.created_at '
      + 'from json where url="https://api.github.com/users/' + config.user
      + '/events/public?per_page=100"'),
    dataType: 'jsonp',
    success: function( data ) {
      callback(parseGithub(data));
    }
  });

  // Expose the template.
  // We use this to check which templates are available
  return {
    "template" : template
  };

};
})(jQuery);
