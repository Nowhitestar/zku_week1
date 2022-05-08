pragma circom 2.0.3;

// [assignment] Modify the circuit below to perform a multiplication of three signals
template Multiplier2 () {  

   // Declaration of signals.  
   signal input in1;  
   signal input in2;  
   signal output out;  

   // Constraints.  
   out <== in1 * in2;  
}

template Multiplier3 () {  

   // Declaration of signals and components.  
   signal input a;  
   signal input b;
   signal input c;
   signal output d;  

   component mult1 = Multiplier2();
   component mult2 = Multiplier2();
   
   // Constraints. 
   mult1.in1 <== a;
   mult1.in2 <== b;
   mult2.in1 <== mult1.out;
   mult2.in2 <== c;
   d <== mult2.out;
}

component main  = Multiplier3();