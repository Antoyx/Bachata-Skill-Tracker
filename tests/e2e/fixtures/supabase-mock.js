// Injected before app.js via page.addInitScript().
// The Supabase CDN is blocked by page.route() in beforeEach so it cannot
// overwrite this mock after it is set.

(function () {
  'use strict';

  const FIXTURE_SKILLS = [
    {
      id: 'skill-1', section: 'moves', name: 'Basic Step',
      notes: '4-count side-to-side foundation',
      level: 0, difficulty: 0, working_on: false,
      created_at: '2024-01-01T00:00:00Z', variations: [],
    },
    {
      id: 'skill-2', section: 'moves', name: 'Cross Body Lead',
      notes: 'Send follower across the line of dance',
      level: 3, difficulty: 0, working_on: false,
      created_at: '2024-01-02T00:00:00Z', variations: [],
    },
    {
      id: 'skill-3', section: 'styling', name: 'Arm Waves',
      notes: 'Fluid wave from shoulder to fingertips',
      level: 5, difficulty: 1, working_on: true,
      created_at: '2024-01-03T00:00:00Z', variations: [],
    },
  ];

  function makeBuilder(data) {
    const promise = Promise.resolve({ data: data, error: null });
    return {
      select:  function () { return makeBuilder(data); },
      eq:      function () { return makeBuilder(data); },
      order:   function () { return makeBuilder(data); },
      insert:  function () { return makeBuilder([]); },
      update:  function () { return makeBuilder(null); },
      delete:  function () { return makeBuilder(null); },
      upsert:  function () { return makeBuilder(null); },
      single:  function () { return makeBuilder(data && data[0] ? data[0] : null); },
      then:    function (res, rej) { return promise.then(res, rej); },
      catch:   function (fn) { return promise.catch(fn); },
      finally: function (fn) { return promise.finally(fn); },
    };
  }

  window.supabase = {
    createClient: function () {
      return {
        auth: {
          getSession: async function () {
            return {
              data: {
                session: {
                  user: { id: 'test-user-id', email: 'test@example.com' },
                },
              },
            };
          },
          onAuthStateChange: function () {
            return { data: { subscription: { unsubscribe: function () {} } } };
          },
          signOut: async function () { return {}; },
        },
        from: function (table) {
          return makeBuilder(table === 'skills' ? FIXTURE_SKILLS : []);
        },
      };
    },
  };
}());
