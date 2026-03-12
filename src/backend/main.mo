import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Setup {
    public func compare(setup1 : TradingSetup, setup2 : TradingSetup) : Order.Order {
      Text.compare(setup1.name, setup2.name);
    };
  };

  type TradingSetup = {
    name : Text;
    pairSymbol : Text;
    accountBalance : Float;
    accountCurrency : Text;
    riskPercentage : Float;
    entryPrice : Float;
    stopLossPrice : Float;
    takeProfitPrice : Float;
    lotSize : Float;
    notes : ?Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let usersSetups = Map.empty<Principal, Map.Map<Nat, TradingSetup>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextSetupId = 0;

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Trading Setup Functions
  public shared ({ caller }) func saveSetup(setup : TradingSetup) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save setups");
    };

    let userSetups = switch (usersSetups.get(caller)) {
      case (?setups) { setups };
      case (null) {
        let newSetups = Map.empty<Nat, TradingSetup>();
        usersSetups.add(caller, newSetups);
        newSetups;
      };
    };

    let existingId = userSetups.entries().find(
      func((id, s)) { s.name == setup.name }
    );

    switch (existingId) {
      case (?(id, _)) {
        userSetups.add(id, setup);
        id;
      };
      case (null) {
        let setupId = nextSetupId;
        userSetups.add(setupId, setup);
        nextSetupId += 1;
        setupId;
      };
    };
  };

  public query ({ caller }) func getSetups() : async [(Nat, TradingSetup)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access setups");
    };

    switch (usersSetups.get(caller)) {
      case (?setups) { setups.toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getSetup(setupId : Nat) : async TradingSetup {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access setups");
    };

    switch (usersSetups.get(caller)) {
      case (?setups) {
        switch (setups.get(setupId)) {
          case (?setup) { setup };
          case (null) { Runtime.trap("Setup with id " # setupId.toText() # " does not exist") };
        };
      };
      case (null) { Runtime.trap("No setups found for user") };
    };
  };

  public shared ({ caller }) func deleteSetup(setupId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete setups");
    };

    switch (usersSetups.get(caller)) {
      case (?userSetups) {
        if (userSetups.containsKey(setupId)) {
          userSetups.remove(setupId);
        } else {
          Runtime.trap("Setup with id " # setupId.toText() # " does not exist");
        };
      };
      case (null) { Runtime.trap("No setups found for user") };
    };
  };
};
