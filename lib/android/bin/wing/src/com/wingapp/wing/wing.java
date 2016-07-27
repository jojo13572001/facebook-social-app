/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.wingapp.wing;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

import android.os.Bundle;

import com.parse.Parse;
import com.parse.ParseAnalytics;
import com.parse.PushService;

public class wing extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")
        Parse.initialize(this, "HSv5IbIBMGEbGD2Y3lgZ275d5Lfdi2OurjjeXGfP", "D3nrhYvXkIbgdY8FCCknhz32WIKVW07FbsNOAecE");
    	PushService.setDefaultPushCallback(this, wing.class);
    	PushService.subscribe(this, "match", wing.class);
    	PushService.subscribe(this, "pay", wing.class);
    	ParseAnalytics.trackAppOpened(getIntent());
    }
}