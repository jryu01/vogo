#!/bin/bash

# plist update for ios 9 
# reference: https://developers.facebook.com/docs/ios/ios9
# https://developer.apple.com/library/prerelease/ios/technotes/App-Transport-Security-Technote/index.html

# whitelist api server, facebook, bing, and aws s3

PLIST=platforms/ios/*/*-Info.plist

cat << EOF |
Add :NSAppTransportSecurity dict
Add :NSAppTransportSecurity:NSExceptionDomains dict

Add :NSAppTransportSecurity:NSExceptionDomains:vogo-api-production.elasticbeanstalk.com dict
Add :NSAppTransportSecurity:NSExceptionDomains:vogo-api-production.elasticbeanstalk.com:NSIncludesSubdomains bool YES
Add :NSAppTransportSecurity:NSExceptionDomains:vogo-api-production.elasticbeanstalk.com:NSExceptionAllowsInsecureHTTPLoads bool YES

Add :NSAppTransportSecurity:NSExceptionDomains:facebook.com dict
Add :NSAppTransportSecurity:NSExceptionDomains:facebook.com:NSIncludesSubdomains bool YES
Add :NSAppTransportSecurity:NSExceptionDomains:facebook.com:NSExceptionRequiresForwardSecrecy bool NO

Add :NSAppTransportSecurity:NSExceptionDomains:fbcdn.net dict
Add :NSAppTransportSecurity:NSExceptionDomains:fbcdn.net:NSIncludesSubdomains bool YES
Add :NSAppTransportSecurity:NSExceptionDomains:fbcdn.net:NSExceptionRequiresForwardSecrecy bool NO

Add :NSAppTransportSecurity:NSExceptionDomains:akamaihd.net dict
Add :NSAppTransportSecurity:NSExceptionDomains:akamaihd.net:NSIncludesSubdomains bool YES
Add :NSAppTransportSecurity:NSExceptionDomains:akamaihd.net:NSExceptionRequiresForwardSecrecy bool NO

Add :NSAppTransportSecurity:NSExceptionDomains:bing.net dict
Add :NSAppTransportSecurity:NSExceptionDomains:bing.net:NSIncludesSubdomains bool YES
Add :NSAppTransportSecurity:NSExceptionDomains:bing.net:NSExceptionAllowsInsecureHTTPLoads bool YES

Add :NSAppTransportSecurity:NSExceptionDomains:s3.amazonaws.com dict
Add :NSAppTransportSecurity:NSExceptionDomains:s3.amazonaws.com:NSExceptionRequiresForwardSecrecy bool NO
Add :NSAppTransportSecurity:NSExceptionDomains:s3.amazonaws.com:NSIncludesSubdomains bool YES

Add :LSApplicationQueriesSchemes array
Add :LSApplicationQueriesSchemes:0 string "fbapi"
Add :LSApplicationQueriesSchemes:1 string "fbapi20130214"
Add :LSApplicationQueriesSchemes:2 string "fbapi20130410"
Add :LSApplicationQueriesSchemes:3 string "fbapi20130702"
Add :LSApplicationQueriesSchemes:4 string "fbapi20131010"
Add :LSApplicationQueriesSchemes:5 string "fbapi20131219"
Add :LSApplicationQueriesSchemes:6 string "fbapi20140410"
Add :LSApplicationQueriesSchemes:7 string "fbapi20140116"
Add :LSApplicationQueriesSchemes:8 string "fbapi20150313"
Add :LSApplicationQueriesSchemes:9 string "fbapi20150629"
Add :LSApplicationQueriesSchemes:10 string "fbauth"
Add :LSApplicationQueriesSchemes:11 string "fbauth2"
Add :LSApplicationQueriesSchemes:12 string "fb-messenger-api20140430"
Add :LSApplicationQueriesSchemes:13 string "mailto"
EOF
while read line
do
    /usr/libexec/PlistBuddy -c "$line" $PLIST
done

true