package com.irmobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.balthazargronon.RCTZeroconf.ZeroconfReactPackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import io.branch.rnbranch.RNBranchPackage;
import io.branch.referral.Branch;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;
import com.microsoft.codepush.react.CodePush;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    // Override the getJSBundleFile method in order to let
    // the CodePush runtime determine where to get the JS
    // bundle location from on each app start
    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ZeroconfReactPackage(),
          new RNNetworkInfoPackage(),
          new RNBranchPackage(),
          new VectorIconsPackage(),
          new CodePush("_snNXg5Yo8CHY0NGGoDQD6z7yEjAfc5fc98b-7620-40bb-852a-4c126fc95f78", MainApplication.this, BuildConfig.DEBUG)

      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Branch.getAutoInstance(this);
  }
}
