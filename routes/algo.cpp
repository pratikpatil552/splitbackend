#include<bits/stdc++.h>
#define ll long long
#define ff first
#define ss second
#define INF 1e18
using namespace std;

vector<pair<pair<string,string>,ll>> dfs (ll i, ll n, vector<pair<ll,string>>&temp){
    if(i == n){
        return {};
    }
    if(temp[i].first == 0) return dfs(i+1,n,temp);
    vector<pair<pair<string,string>,ll>>ans(10000);
    for (ll j = i+1; j<n; j++){
        ll backup = temp[j].first;
        if(temp[i].first*temp[j].first<0){
            temp[j].first += temp[i].first;
            vector<pair<pair<string,string>,ll>>tempans = dfs(i+1,n,temp);
            if(temp[i].first<0){
                tempans.push_back({{temp[i].second,temp[j].second},-temp[i].first});
            }
            else tempans.push_back({{temp[j].second,temp[i].second},temp[i].first});

            if(tempans.size()<ans.size()){
                ans = tempans;
            }
            temp[j].first = backup;
        }
    }
    return ans;
}


void solve(){
    ll m; cin>>m;
    // from -> to and amount
    vector<pair<pair<string,string>,ll>>arr(m);
    for (auto& it : arr) cin>>it.first.first>>it.first.second>>it.second;

    // creating balancesheet for candidate
    map<string,ll>mp;
    // default value for each candidate is 0
    for (auto it : arr){
        mp[it.first.first] -= it.second;
        mp[it.first.second] += it.second;
    }

    // collecting non zero transactions
    vector<pair<ll,string>>temp;
    for (auto it : mp){
        if(it.second != 0){
            temp.push_back({it.second,it.first});
        }
    }
    ll n = temp.size();
    for (auto it : dfs(0,n,temp)){
        cout<<it.first.first<<" "<<it.first.second<<" "<<it.second<<endl;
    }
}

int main(){
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    solve();
}