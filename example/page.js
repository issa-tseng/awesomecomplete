$(function()
{
    // Imagine, for instance, that this data was rendered server-side
    var mockData = [
        { name: 'Oscar Filippelli', email: 'oscar.filippelli@scranton.dundermifflin.com', phone: '(181) 640-7558' },
        { name: 'Kevin Palmer', email: 'kevin.palmer@yonkers.dundermifflin.com', phone: '(370) 756-3871' },
        { name: 'Kelly Bratton', email: 'kelly.bratton@yonkers.dundermifflin.com', phone: '(779) 742-2016' },
        { name: 'Meredith Bratton', email: 'meredith.bratton@akron.dundermifflin.com', phone: '(859) 454-3707' },
        { name: 'Meredith Howard', email: 'meredith.howard@akron.dundermifflin.com', phone: '(777) 878-5545' },
        { name: 'Andy Martin', email: 'andy.martin@camden.dundermifflin.com', phone: '(151) 597-5185' },
        { name: 'Creed Halpert', email: 'creed.halpert@buffalo.dundermifflin.com', phone: '(641) 938-3253' },
        { name: 'Karen Howard', email: 'karen.howard@buffalo.dundermifflin.com', phone: '(299) 410-6988' },
        { name: 'Phyllis Malone', email: 'phyllis.malone@stamford.dundermifflin.com', phone: '(506) 789-1768' },
        { name: 'Jim Howard', email: 'jim.howard@scranton.dundermifflin.com', phone: '(323) 898-5595' },
        { name: 'Michael Scott', email: 'michael.scott@yonkers.dundermifflin.com', phone: '(601) 344-3575' },
        { name: 'Jim Martinez', email: 'jim.martinez@camden.dundermifflin.com', phone: '(532) 681-3523' },
        { name: 'Michael Filippelli', email: 'michael.filippelli@nashua.dundermifflin.com', phone: '(582) 598-6304' },
        { name: 'Michael Bernard', email: 'michael.bernard@yonkers.dundermifflin.com', phone: '(110) 826-6941' },
        { name: 'Jim Malone', email: 'jim.malone@utica.dundermifflin.com', phone: '(704) 733-1674' },
        { name: 'Angela Scott', email: 'angela.scott@akron.dundermifflin.com', phone: '(345) 196-5510' },
        { name: 'Michael Howard', email: 'michael.howard@nashua.dundermifflin.com', phone: '(596) 624-5819' },
        { name: 'Meredith Schrute', email: 'meredith.schrute@nashua.dundermifflin.com', phone: '(933) 835-4234' },
        { name: 'Ryan Kapoor', email: 'ryan.kapoor@albany.dundermifflin.com', phone: '(337) 537-2927' },
        { name: 'Ryan Bernard', email: 'ryan.bernard@scranton.dundermifflin.com', phone: '(714) 512-4654' },
        { name: 'Michael Lapin', email: 'michael.lapin@buffalo.dundermifflin.com', phone: '(314) 985-8286' },
        { name: 'Oscar Bernard', email: 'oscar.bernard@yonkers.dundermifflin.com', phone: '(576) 740-3530' },
        { name: 'Michael Filippelli', email: 'michael.filippelli@yonkers.dundermifflin.com', phone: '(282) 668-4540' },
        { name: 'Kelly Hudson', email: 'kelly.hudson@albany.dundermifflin.com', phone: '(683) 390-8440' },
        { name: 'Creed Scott', email: 'creed.scott@scranton.dundermifflin.com', phone: '(190) 378-2914' },
        { name: 'Angela Filippelli', email: 'angela.filippelli@yonkers.dundermifflin.com', phone: '(712) 158-6710' },
        { name: 'Creed Filippelli', email: 'creed.filippelli@yonkers.dundermifflin.com', phone: '(339) 932-6205' },
        { name: 'Angela Bratton', email: 'angela.bratton@scranton.dundermifflin.com', phone: '(942) 351-7387' },
        { name: 'Pam Kapoor', email: 'pam.kapoor@yonkers.dundermifflin.com', phone: '(850) 982-1217' },
        { name: 'Michael Lapin', email: 'michael.lapin@albany.dundermifflin.com', phone: '(944) 425-3651' },
        { name: 'Dwight Beesly', email: 'dwight.beesly@stamford.dundermifflin.com', phone: '(945) 351-9926' },
        { name: 'Oscar Lapin', email: 'oscar.lapin@stamford.dundermifflin.com', phone: '(846) 324-4236' },
        { name: 'Pam Hudson', email: 'pam.hudson@stamford.dundermifflin.com', phone: '(324) 935-4878' },
        { name: 'Angela Filippelli', email: 'angela.filippelli@stamford.dundermifflin.com', phone: '(879) 276-8242' },
        { name: 'Stanley Bernard', email: 'stanley.bernard@scranton.dundermifflin.com', phone: '(629) 385-1648' },
        { name: 'Kelly Halpert', email: 'kelly.halpert@akron.dundermifflin.com', phone: '(617) 253-9621' },
        { name: 'Meredith Scott', email: 'meredith.scott@albany.dundermifflin.com', phone: '(341) 641-9785' },
        { name: 'Ryan Lapin', email: 'ryan.lapin@albany.dundermifflin.com', phone: '(512) 829-4442' },
        { name: 'Angela Kapoor', email: 'angela.kapoor@yonkers.dundermifflin.com', phone: '(435) 149-4341' },
        { name: 'Pam Martin', email: 'pam.martin@buffalo.dundermifflin.com', phone: '(204) 189-7995' }
    ];

    $('#friend_id').awesomecomplete({
        noResultsMessage: '<p>no results found!</p>',
        staticData: mockData,
        valueFunction: function(dataItem) {
            return dataItem['name'] + ' <' + dataItem['email'] + '>';
        }
    });
});