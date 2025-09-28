#include <iostream>
#include <string>
using namespace std;

int main() {
    
    int num[2];
    num[0]=1;
    cout<<"enter a number: ";
    cin>>num[1];
    
    for(int i= num[0];i<=num[1];i++){
    for(int j=num[0];j<=i;j++){
    cout<<j;
    }
    cout<<endl;
    }
    cout<<endl;
    
    for(int i= num[0];i<=num[1];i++){
    for(int j=num[0];j<=i;j++){
    cout<<i;
    }
    cout<<endl;
    }
    
    
    return 0;
}